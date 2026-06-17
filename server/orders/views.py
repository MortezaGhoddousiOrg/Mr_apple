from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.utils import timezone
from django.conf import settings
import requests
from .models import Orders, OrderItems, Payments, Cart
from .serializers import (
    OrderSerializer,
    OrderItemSerializer,
    PaymentSerializer,
    CartSerializer
)
from catalog.models import Products
from rest_framework.permissions import IsAdminUser

from django.contrib.auth import get_user_model
from django.shortcuts import redirect


import httpx
import ssl
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# CART

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        cart_items = Cart.objects.select_related("product").filter(user=user)

        items_data = []
        total_amount = 0
        total_quantity = 0

        for item in cart_items:
            product = item.product
            item_total = product.sell_price * item.quantity

            items_data.append({
                "product_id": product.id,
                "name": product.name,
                "price": product.sell_price,
                "cart_quantity": item.quantity,
                "quantity": product.quantity,
                "total_price": item_total,
                "image": product.images.first().image.url if product.images.exists() else None
            })

            total_amount += item_total
            total_quantity += item.quantity

        return Response({
            "items": items_data,
            "total_amount": total_amount,
            "total_quantity": total_quantity
        })


class AddToCart(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user

        # Validate product_id
        product_id = request.data.get("product_id")
        if not product_id:
            return Response({"error": "product_id is required"}, status=400)

        try:
            product = Products.objects.get(id=product_id)
        except Products.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        # Validate quantity
        try:
            quantity = int(request.data.get("quantity", 1))
        except:
            return Response({"error": "Invalid quantity"}, status=400)

        if quantity <= 0:
            return Response({"error": "Quantity must be greater than zero"}, status=400)

        if product.status != "active":
            return Response({"error": "Product is inactive"}, status=400)

        if product.quantity < quantity:
            return Response({"error": "Insufficient inventory"}, status=400)

        # Safe update (prevents IntegrityError)
        cart_item = Cart.objects.filter(user=user, product=product).first()

        if cart_item:
            new_quantity = cart_item.quantity + quantity

            if new_quantity > product.quantity:
                return Response({"error": "Insufficient inventory"}, status=400)

            cart_item.quantity = new_quantity
            cart_item.save()

        else:
            Cart.objects.create(
                user=user,
                product=product,
                quantity=quantity
            )

        return Response({"message": "Added to cart"}, status=200)


class RemoveFromCart(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        product_id = request.data.get("product_id")

        if not product_id:
            return Response({"error": "product_id is required"}, status=400)

        try:
            item = Cart.objects.get(user=user, product_id=product_id)
        except Cart.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        item.delete()
        return Response({"message": "Removed from cart"}, status=200)


class UpdateQuantity(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        product_id = request.data.get("product_id")
        quantity = request.data.get("quantity")

        if not product_id or quantity is None:
            return Response({"error": "product_id and quantity are required"}, status=400)

        try:
            quantity = int(quantity)
        except:
            return Response({"error": "Invalid quantity"}, status=400)

        if quantity <= 0:
            return Response({"error": "Quantity must be greater than zero"}, status=400)

        try:
            item = Cart.objects.get(user=user, product_id=product_id)
        except Cart.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        if quantity > item.product.quantity:
            return Response({"error": "Insufficient inventory"}, status=400)

        item.quantity = quantity
        item.save()

        return Response({"message": "Quantity updated"}, status=200)


# CREATE ORDER (ساخت سفارش)

class CreateOrder(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):  

        User = get_user_model()
        phone = request.user
        user = User.objects.get(phone=phone)
        user_id = user.id

        cart_items = Cart.objects.select_related("product").filter(user_id=user_id)

        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        total_amount = 0

        for item in cart_items:
            if item.product.status != "active":
                return Response({"error": f"{item.product.name} is inactive"}, status=400)

            if item.quantity > item.product.quantity:
                return Response({"error": f"Insufficient inventory for {item.product.name}"}, status=400)

            total_amount += item.product.sell_price * item.quantity

        # --- Save to DB in its own transaction, isolated from gateway call ---
        with transaction.atomic():
            order = Orders.objects.create(
                user_id=user_id,
                total_amount=total_amount,
                status="pending",
                product_status="pending"
            )

            for item in cart_items:
                OrderItems.objects.create(
                    order_id=order.id,
                    product_id=item.product.id,
                    quantity=item.quantity,
                    price=item.product.sell_price
                )

            payment = Payments.objects.create(
                order_id=order.id,
                gateway="Zarinpal",
                status="pending"
            )

        # --- Gateway call outside transaction so DB isn't rolled back on failure ---
        data = {
            "merchant_id": settings.ZARINPAL_MERCHANT_ID,
            "amount": int(total_amount * 10),
            "callback_url": settings.ZARINPAL_CALLBACK_URL,
            "description": f"پرداخت سفارش شماره {order.id}",
        }

        try:
            # Bypass broken sandbox SSL
            ssl_ctx = ssl.create_default_context()
            ssl_ctx.check_hostname = False
            ssl_ctx.verify_mode = ssl.CERT_NONE

            with httpx.Client(verify=False) as client:
                resp = client.post(
                    "https://sandbox.zarinpal.com/pg/v4/payment/request.json",
                    json=data,
                    timeout=15
                )
            response = resp.json()

        except Exception as e:
            payment.status = "failed"
            payment.save()
            order.status = "failed"  # add this
            order.save()
            return Response({"error": "Gateway unreachable", "details": str(e)}, status=502)

        if response.get("data", {}).get("code") == 100:
            authority = response["data"]["authority"]
            payment.authority = authority
            payment.save()

            return Response({
                "payment_url": f"https://sandbox.zarinpal.com/pg/StartPay/{authority}",
                "payment_id": payment.id
            })
        else:
            payment.status = "failed"
            payment.save()
            order.status = "failed"  # add this
            order.save()
            return Response(
                {"error": "Payment gateway error", "details": response.get("errors")},
                status=502
            )


# PAYMENT

# class CreatePayment(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         order_id = request.data.get("order_id")

#         try:
#             order = Orders.objects.get(id=order_id, user=request.user)
#         except Orders.DoesNotExist:
#             return Response({"error": "Order not found"}, status=404)

        

#         payment = Payments.objects.create(
#             order_id=order,
#             gateway="Zarinpal",
#             status="pending"
#         )
#         return Response({
#             "message": "Payment created",
#             "payment": PaymentSerializer(payment).data
#         })


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
    

# class ZarinpalRequest(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         order_id = request.data.get("order_id")

#         try:
#             order = Orders.objects.get(id=order_id, user=request.user)
#         except Orders.DoesNotExist:
#             return Response({"error": "Order not found"}, status=404)

#         amount = order.total_amount  # ریال

#         payment = Payments.objects.create(
#             order=order,
#             gateway="Zarinpal",
#             status="pending"
#         )

#         data = {
#             "merchant_id": settings.ZARINPAL_MERCHANT_ID,
#             "amount": amount * 10,
#             "callback_url": settings.ZARINPAL_CALLBACK_URL,
#             "description": f"پرداخت سفارش شماره {order.id}",
#         }

#         response = requests.post(
#             "https://sandbox.zarinpal.com/pg/v4/payment/request.json",
#             json=data
#         ).json()

#         if response["data"]["code"] == 100:
#             authority = response["data"]["authority"]
#             payment.authority = authority
#             payment.save()

#             return Response({
#                 "payment_url": f"https://sandbox.zarinpal.com/pg/StartPay/{authority}",
#                 "payment_id": payment.id
#             })

#         return Response({"error": "Zarinpal request failed", "details": response})

class ZarinpalVerify(APIView):

    def get(self, request):
        authority = request.GET.get("Authority")
        status = request.GET.get("Status")

        if not authority:
            return redirect("http://localhost:3000/Payment?status=false")

        try:
            payment = Payments.objects.select_related("order", "order__user").get(
                authority=authority
            )
        except Payments.DoesNotExist:
            return redirect("http://localhost:3000/Payment?status=false")

        if status != "OK":
            payment.status = "failed"
            payment.save(update_fields=["status"])
            return redirect("http://localhost:3000/Payment?status=false")

        verify_data = {
            "merchant_id": settings.ZARINPAL_MERCHANT_ID,
            "amount": int(payment.order.total_amount * 10),  # same amount used in request
            "authority": authority,
        }

        try:
            response = requests.post(
                "https://sandbox.zarinpal.com/pg/v4/payment/verify.json",
                json=verify_data,
                timeout=15,
            )

            response.raise_for_status()

            result = response.json()

        except requests.RequestException as e:
            print("Zarinpal Verify Request Error:", str(e))

            payment.status = "failed"
            payment.save(update_fields=["status"])

            return redirect("http://localhost:3000/Payment?status=false")

        print("Zarinpal Verify Response:", result)

        data = result.get("data", {})
        errors = result.get("errors", {})

        code = data.get("code")

        # Successful payment
        if code == 100:

            payment.status = "success"
            payment.ref_id = str(data.get("ref_id", ""))
            payment.paid_at = timezone.now()
            payment.save()

            order = payment.order
            order.status = "paid"
            order.paid_at = timezone.now()
            order.save()

            # Remove purchased items from cart
            Cart.objects.filter(user=order.user).delete()

            return redirect(
                f"http://localhost:3000/Payment?status=true&ref_id={payment.ref_id}"
            )

        # Already verified payment
        elif code == 101:

            return redirect(
                f"http://localhost:3000/Payment?status=true&ref_id={payment.ref_id}"
            )

        # Failed verification
        else:
            print("Zarinpal Verify Error:", errors)

            payment.status = "failed"
            payment.save(update_fields=["status"])

            error_code = errors.get("code", "unknown")

            return redirect(
                f"http://localhost:3000/Payment?status=false&error={error_code}"
            )



class AdminOrderListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        orders = Orders.objects.select_related("user").prefetch_related("items", "payments")

        data = []

        for order in orders:
            items = []
            total_quantity = 0

            for item in order.items.all():
                items.append({
                    "product_id": item.product.id,
                    "product_name": item.product.name,
                    "product_code": item.product.product_code,
                    "quantity": item.quantity,
                    "price": item.price,
                    "total_price": item.quantity * item.price
                })
                total_quantity += item.quantity

            data.append({
                "id": order.id,
                "order_number": f"ORD-{order.created_at.strftime('%Y%m%d')}-{order.id:04d}",
                "user": {
                    "id": order.user.id,
                    "firstname": order.user.first_name,
                    "lastname": order.user.last_name,
                    "phone": order.user.phone,
                    "email": order.user.email,
                },
                "items": items,
                "total_amount": order.total_amount,
                "total_quantity": total_quantity,
                "status": order.status,
                "product_status": order.product_status,
                "payment_status": order.payments.last().status if order.payments.exists() else "pending",
                "payment_method": "online",
                "shipping_address": {
                    "postal_code": getattr(order, "shipping_postal_code", None),
                    "address": getattr(order, "shipping_address", None)
                },
                "notes": getattr(order, "notes", ""),
                "created_at": order.created_at,
                "updated_at": order.updated_at,
                "paid_at": order.paid_at,
                "shipped_at": getattr(order, "shipped_at", None),
                "delivered_at": getattr(order, "delivered_at", None),
            })

        return Response(data, status=200)
    
    
class AdminOrderUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, order_id):
        try:
            order = Orders.objects.get(id=order_id)
        except Orders.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        status_value = request.data.get("status")
        product_status = request.data.get("product_status")
        payment_status = request.data.get("payment_status")
        shipped_at = request.data.get("shipped_at")
        delivered_at = request.data.get("delivered_at")

        if status_value:
            order.status = status_value

        if product_status:
            order.product_status = product_status

        if payment_status:
            # آخرین پرداخت را آپدیت می‌کنیم
            payment = order.payments.last()
            if payment:
                payment.status = payment_status
                payment.save()

        if shipped_at:
            order.shipped_at = shipped_at

        if delivered_at:
            order.delivered_at = delivered_at

        order.save()

        return Response({"message": "Order updated successfully"}, status=200)


class MyOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        User = get_user_model()
        phone = request.user
        user = User.objects.get(phone=phone)
        user_id = user.id
        orders = Orders.objects.filter(user_id=user_id).prefetch_related("items")

        data = []

        for order in orders:
            items = []
            for item in order.items.all():
                items.append({
                    "product_id": item.product.id,
                    "product_name": item.product.name,
                    "product_code": item.product.product_code,
                    "quantity": item.quantity,
                    "price": item.price,
                    "total_price": item.quantity * item.price,
                    "image": item.product.images.first().image.url if item.product.images.exists() else None
                })

            data.append({
                "id": order.id,
                "total_amount": order.total_amount,
                "status": order.status,
                "product_status": order.product_status,
                "created_at": order.created_at,
                "paid_at": order.paid_at,
                "items": items
            })

        return Response(data, status=200)


class MyOrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        User = get_user_model()
        phone = request.user
        user = User.objects.get(phone=phone)
        user_id = user.id

        try:
            order = Orders.objects.get(id=order_id, user_id=user_id)
        except Orders.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        items = []
        for item in order.items.all():
            items.append({
                "product_id": item.product.id,
                "product_name": item.product.name,
                "product_code": item.product.product_code,
                "quantity": item.quantity,
                "price": item.price,
                "total_price": item.quantity * item.price,
                "image": item.product.images.first().image.url if item.product.images.exists() else None
            })

        return Response({
            "id": order.id,
            "total_amount": order.total_amount,
            "status": order.status,
            "product_status": order.product_status,
            "created_at": order.created_at,
            "paid_at": order.paid_at,
            "items": items
        }, status=200)