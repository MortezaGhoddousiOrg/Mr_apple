from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.db import transaction
from django.utils import timezone
from django.conf import settings
from django.shortcuts import get_object_or_404, redirect
import requests
import httpx
import ssl
import urllib3

from authuser.authentication import AdminJWTAuthentication, UserJWTAuthentication
from .models import Orders, OrderItems, Payments, Cart
from .serializers import (
    OrderSerializer,
    OrderItemSerializer,
    PaymentSerializer,
    CartSerializer,
)
from catalog.models import Products, ProductVariant

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


# -------------------------------
# CART VIEW
# -------------------------------

class CartView(APIView):
    authentication_classes = [UserJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        cart_items = Cart.objects.select_related(
            "product",
            "variant",
            "product__category_id",
            "product__category_id__parent",
        ).prefetch_related("product__images")

        items_data = []
        total_amount = 0
        total_quantity = 0

        for item in cart_items:
            product = item.product
            variant = item.variant

            # دسته‌بندی
            category_obj = getattr(product, "category_id", None)
            category_title = category_obj.title if category_obj else None
            brand_title = (
                category_obj.parent.title
                if category_obj and category_obj.parent
                else None
            )

            # تصویر
            main_image = product.images.filter(is_main=True).first()
            if not main_image:
                main_image = product.images.first()

            image_url = (
                main_image.image.url if main_image and main_image.image else None
            )

            # قیمت و تخفیف
            if variant:
                original_price = int(variant.price or 0)
                discount_percent = float(variant.discount or 0)
            else:
                original_price = int(product.sell_price or 0)
                discount_percent = float(product.discount or 0)

            if discount_percent > 0:
                price = int(original_price * (100 - discount_percent) / 100)
            else:
                price = original_price

            cart_quantity = item.quantity
            total_price = price * cart_quantity

            # موجودی
            inventory_quantity = variant.quantity if variant else product.quantity

            items_data.append(
                {
                    "product_id": product.id,
                    "variant_id": variant.id if variant else None,
                    "name": product.name,
                    "image": image_url,
                    "original_price": original_price,
                    "discount_percent": discount_percent,
                    "price": price,
                    "cart_quantity": cart_quantity,
                    "quantity": inventory_quantity,
                    "total_price": total_price,
                    "description": product.descriptions,
                    "more_description": product.more_description,
                    "sku": product.product_code,
                    "brand": brand_title,
                    "category": category_title,
                    "color": (getattr(variant, "color", None) if variant else None),
                    "duration_months": (
                        getattr(variant, "duration_months", None) if variant else None
                    ),
                    "condition": (
                        getattr(variant, "condition", None) if variant else None
                    ),
                    "warranty": (
                        getattr(variant, "warranty", None) if variant else None
                    ),
                    "warranty_months": (
                        getattr(variant, "warranty_months", None) if variant else None
                    ),
                }
            )

            total_amount += total_price
            total_quantity += cart_quantity

        return Response(
            {
                "items": items_data,
                "total_amount": total_amount,
                "total_quantity": total_quantity,
            },
            status=200,
        )


# -------------------------------
# ADD TO CART
# -------------------------------

class AddToCart(APIView):
    authentication_classes = [UserJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        product_id = request.data.get("product_id")
        if not product_id:
            return Response({"error": "product_id is required"}, status=400)

        try:
            product = Products.objects.get(id=product_id)
        except Products.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        try:
            quantity = int(request.data.get("quantity", 1))
        except Exception:
            return Response({"error": "Invalid quantity"}, status=400)

        if quantity <= 0:
            return Response({"error": "Quantity must be greater than zero"}, status=400)

        if product.status != "active":
            return Response({"error": "Product is inactive"}, status=400)

        variant_id = request.data.get("variant_id")
        variant = None

        if variant_id:
            try:
                variant = ProductVariant.objects.get(
                    id=variant_id,
                    product=product,
                    is_active=True,
                )
            except ProductVariant.DoesNotExist:
                return Response({"error": "Variant not found"}, status=404)

            if variant.quantity < quantity:
                return Response({"error": "Insufficient inventory for this variant"}, status=400)
        else:
            if product.quantity < quantity:
                return Response({"error": "Insufficient inventory"}, status=400)

        if variant:
            cart_item = Cart.objects.filter(
                user=user,
                product=product,
                variant=variant,
            ).first()
        else:
            cart_item = Cart.objects.filter(
                user=user,
                product=product,
                variant__isnull=True,
            ).first()

        if cart_item:
            new_quantity = cart_item.quantity + quantity

            if variant:
                if new_quantity > variant.quantity:
                    return Response({"error": "Insufficient inventory for this variant"}, status=400)
            else:
                if new_quantity > product.quantity:
                    return Response({"error": "Insufficient inventory"}, status=400)

            cart_item.quantity = new_quantity
            cart_item.save()
        else:
            Cart.objects.create(
                user=user,
                product=product,
                variant=variant,
                quantity=quantity,
            )

        return Response({"message": "Added to cart"}, status=200)


# -------------------------------
# REMOVE FROM CART
# -------------------------------

class RemoveFromCart(APIView):
    authentication_classes = [UserJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        product_id = request.data.get("product_id")
        variant_id = request.data.get("variant_id")

        if not product_id:
            return Response({"error": "product_id is required"}, status=400)

        qs = Cart.objects.filter(user=user, product_id=product_id)

        if variant_id:
            qs = qs.filter(variant_id=variant_id)
        else:
            qs = qs.filter(variant__isnull=True)

        try:
            item = qs.get()
        except Cart.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        item.delete()

        return Response({"message": "Removed from cart"}, status=200)


# -------------------------------
# UPDATE QUANTITY
# -------------------------------

class UpdateQuantity(APIView):
    authentication_classes = [UserJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        product_id = request.data.get("product_id")
        variant_id = request.data.get("variant_id")
        quantity = request.data.get("quantity")

        if not product_id or quantity is None:
            return Response({"error": "product_id and quantity are required"}, status=400)

        try:
            quantity = int(quantity)
        except Exception:
            return Response({"error": "Invalid quantity"}, status=400)

        if quantity <= 0:
            return Response({"error": "Quantity must be greater than zero"}, status=400)

        qs = Cart.objects.filter(user=user, product_id=product_id)

        if variant_id:
            qs = qs.filter(variant_id=variant_id)
        else:
            qs = qs.filter(variant__isnull=True)

        try:
            item = qs.get()
        except Cart.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        if item.variant:
            if quantity > item.variant.quantity:
                return Response({"error": "Insufficient inventory for this variant"}, status=400)
        else:
            if quantity > item.product.quantity:
                return Response({"error": "Insufficient inventory"}, status=400)

        item.quantity = quantity
        item.save()

        return Response({"message": "Quantity updated"}, status=200)


# -------------------------------
# CREATE ORDER
# -------------------------------

class CreateOrder(APIView):
    authentication_classes = [UserJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_id = user.id

        cart_items = Cart.objects.select_related("product", "variant").filter(user_id=user_id)

        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        total_amount = 0

        for item in cart_items:
            product = item.product
            variant = item.variant

            if product.status != "active":
                return Response({"error": f"{product.name} is inactive"}, status=400)

            if variant:
                if item.quantity > variant.quantity:
                    return Response({"error": f"Insufficient inventory for {product.name} (variant)"}, status=400)

                original_price = int(variant.price or 0)
                discount_percent = float(variant.discount or 0)
            else:
                if item.quantity > product.quantity:
                    return Response({"error": f"Insufficient inventory for {product.name}"}, status=400)

                original_price = int(product.sell_price or 0)
                discount_percent = float(product.discount or 0)

            if discount_percent > 0:
                unit_price = int(original_price * (100 - discount_percent) / 100)
            else:
                unit_price = original_price

            total_amount += unit_price * item.quantity

        with transaction.atomic():
            order = Orders.objects.create(
                user_id=user_id,
                total_amount=total_amount,
                status="failed",
                product_status="failed",
            )

            for item in cart_items:
                product = item.product
                variant = item.variant

                if variant:
                    original_price = int(variant.price or 0)
                    discount_percent = float(variant.discount or 0)
                else:
                    original_price = int(product.sell_price or 0)
                    discount_percent = float(product.discount or 0)

                if discount_percent > 0:
                    unit_price = int(original_price * (100 - discount_percent) / 100)
                else:
                    unit_price = original_price

                OrderItems.objects.create(
                    order_id=order.id,
                    product_id=product.id,
                    variant=variant,
                    quantity=item.quantity,
                    price=unit_price,
                )

            payment = Payments.objects.create(
                order_id=order.id,
                gateway="Zarinpal",
                status="failed",
            )

        data = {
            "merchant_id": settings.ZARINPAL_MERCHANT_ID,
            "amount": int(total_amount * 10),
            "callback_url": settings.ZARINPAL_CALLBACK_URL,
            "description": f"پرداخت سفارش شماره {order.id}",
        }

        try:
            ssl_ctx = ssl.create_default_context()
            ssl_ctx.check_hostname = False
            ssl_ctx.verify_mode = ssl.CERT_NONE

            with httpx.Client(verify=False) as client:
                resp = client.post(
                    "https://payment.zarinpal.com/pg/v4/payment/request.json",
                    json=data,
                    timeout=15,
                )

            response = resp.json()

        except Exception as e:
            payment.status = "failed"
            payment.save()
            order.status = "failed"
            order.save()

            return Response(
                {"error": "Gateway unreachable", "details": str(e)},
                status=502,
            )

        if response.get("data", {}).get("code") == 100:
            authority = response["data"]["authority"]
            payment.authority = authority
            payment.save()

            return Response(
                {
                    "payment_url": f"https://payment.zarinpal.com/pg/StartPay/{authority}",
                    "payment_id": payment.id,
                }
            )

        payment.status = "failed"
        payment.save()
        order.status = "failed"
        order.save()

        return Response(
            {"error": "Payment gateway error", "details": response.get("errors")},
            status=502,
        )


# -------------------------------
# UPDATE PAYMENT
# -------------------------------

class UpdatePayment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        payment_id = request.data.get("payment_id")
        status = request.data.get("status")
        ref_id = request.data.get("ref_id")
        sale_reference_id = request.data.get("sale_reference_id")
        res_code = request.data.get("res_code")

        try:
            payment = Payments.objects.get(id=payment_id)
        except Payments.DoesNotExist:
            return Response({"error": "Payment not found"}, status=404)

        payment.status = status
        payment.ref_id = ref_id
        payment.sale_reference_id = sale_reference_id
        payment.res_code = res_code
        payment.paid_at = timezone.now()
        payment.save()

        if status == "success":
            order = payment.order
            order.status = "paid"
            order.paid_at = timezone.now()
            order.save()

        return Response({"message": "Payment updated"})


# -------------------------------
# ZARINPAL VERIFY
# -------------------------------

class ZarinpalVerify(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        authority = request.GET.get("Authority")
        status = request.GET.get("Status")

        if not authority:
            return redirect("https://mr-apple.ir/Payment?status=false")

        try:
            payment = Payments.objects.select_related("order", "order__user").get(authority=authority)
        except Payments.DoesNotExist:
            return redirect("https://mr-apple.ir/Payment?status=false")

        if status != "OK":
            payment.status = "failed"
            payment.save(update_fields=["status"])
            return redirect("https://mr-apple.ir/Payment?status=false")

        verify_data = {
            "merchant_id": settings.ZARINPAL_MERCHANT_ID,
            "amount": int(payment.order.total_amount * 10),
            "authority": authority,
        }

        try:
            response = requests.post(
                "https://payment.zarinpal.com/pg/v4/payment/verify.json",
                json=verify_data,
                timeout=15,
            )

            response.raise_for_status()
            result = response.json()

        except requests.RequestException as e:
            print("Zarinpal Verify Request Error:", str(e))

            payment.status = "failed"
            payment.save(update_fields=["status"])

            return redirect("https://mr-apple.ir/Payment?status=false")

        print("Zarinpal Verify Response:", result)

        data = result.get("data", {})
        errors = result.get("errors", {})
        code = data.get("code")

        if code == 100:
            payment.status = "success"
            payment.ref_id = str(data.get("ref_id", ""))
            payment.paid_at = timezone.now()
            payment.save()

            order = payment.order
            order.status = "paid"
            order.paid_at = timezone.now()
            order.save()

            # کم کردن موجودی
            for item in order.items.select_related("product", "variant"):
                if item.variant:
                    if item.quantity <= item.variant.quantity:
                        item.variant.quantity -= item.quantity
                        item.variant.save()
                else:
                    if item.quantity <= item.product.quantity:
                        item.product.quantity -= item.quantity
                        item.product.save()

            Cart.objects.filter(user=order.user).delete()

            return redirect(
                f"https://mr-apple.ir/Payment?status=true&ref_id={payment.ref_id}"
            )

        if code == 101:
            return redirect(
                f"https://mr-apple.ir/Payment?status=true&ref_id={payment.ref_id}"
            )

        print("Zarinpal Verify Error:", errors)

        payment.status = "failed"
        payment.save(update_fields=["status"])

        error_code = errors.get("code", "unknown")

        return redirect(
            f"https://mr-apple.ir/Payment?status=false&error={error_code}"
        )


# -------------------------------
# ADMIN ORDER LIST
# -------------------------------

class AdminOrderListView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request):
        orders = Orders.objects.select_related("user").prefetch_related("items", "payments")

        data = []

        for order in orders:
            items = []
            total_quantity = 0

            for item in order.items.all():
                items.append(
                    {
                        "product_id": item.product.id,
                        "variant_id": item.variant.id if item.variant else None,
                        "product_name": item.product.name,
                        "product_code": item.product.product_code,
                        "quantity": item.quantity,
                        "price": item.price,
                        "total_price": item.quantity * item.price,
                    }
                )
                total_quantity += item.quantity

            data.append(
                {
                    "id": order.id,
                    "order_number": f"ORD-{order.created_at.strftime('%Y%m%d')}-{order.id:04d}",
                    "user": {
                        "id": order.user.id,
                        "firstname": order.user.firstname,
                        "lastname": order.user.lastname,
                        "phone": order.user.phone,
                        "email": order.user.email,
                        "postal_code": order.user.postal_code,
                        "address": order.user.address,
                    },
                    "items": items,
                    "total_amount": order.total_amount,
                    "total_quantity": total_quantity,
                    "status": order.status,
                    "product_status": order.product_status,
                    "payment_status": (
                        order.payments.last().status if order.payments.exists() else "failed"
                    ),
                    "payment_method": "online",
                    "shipping_address": {
                        "postal_code": getattr(order, "shipping_postal_code", None),
                        "address": getattr(order, "shipping_address", None),
                    },
                }
            )

        return Response(data, status=200)


class AdminOrderUpdateView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]

    def patch(self, request, order_id):
        order = get_object_or_404(Orders, id=order_id)

        if "status" in request.data:
            order.status = request.data["status"]
        if "product_status" in request.data:
            order.product_status = request.data["product_status"]

        if not {"status", "product_status"}.intersection(request.data):
            return Response(
                {"error": "status or product_status is required"},
                status=400,
            )

        order.save()
        return Response(OrderSerializer(order).data, status=200)


class MyOrdersView(APIView):
    authentication_classes = [UserJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Orders.objects.filter(user=request.user).prefetch_related(
            "items", "payments"
        )
        return Response(OrderSerializer(orders, many=True).data, status=200)


class MyOrderDetailView(APIView):
    authentication_classes = [UserJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(
            Orders.objects.prefetch_related("items", "payments"),
            id=order_id,
            user=request.user,
        )
        return Response(OrderSerializer(order).data, status=200)