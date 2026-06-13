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
                "quantity": item.quantity,
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

    @transaction.atomic
    def post(self, request):

        user = request.user

        cart_items = Cart.objects.select_related(
            "product"
        ).filter(
            user=user
        )

        if not cart_items.exists():
            return Response(
                {"error": "Cart is empty"},
                status=400
            )

        total_amount = 0

        for item in cart_items:

            if item.product.status != "active":
                return Response(
                    {
                        "error": f"{item.product.name} is inactive"
                    },
                    status=400
                )

            if item.quantity > item.product.quantity:
                return Response(
                    {
                        "error": f"Insufficient inventory for {item.product.name}"
                    },
                    status=400
                )

            total_amount += (
                item.product.sell_price * item.quantity
            )

        order = Orders.objects.create(
            user=user,
            total_amount=total_amount,
            status="pending",
            product_status="pending"
        )

        for item in cart_items:

            OrderItems.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.sell_price
            )

            item.product.quantity -= item.quantity
            item.product.save()

        cart_items.delete()

        return Response({
            "message": "Order created",
            "order": OrderSerializer(order).data
        })


# PAYMENT

class CreatePayment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("order_id")

        try:
            order = Orders.objects.get(id=order_id, user=request.user)
        except Orders.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        payment = Payments.objects.create(
            order=order,
            gateway="Zarinpal",
            status="pending"
        )

        return Response({
            "message": "Payment created",
            "payment": PaymentSerializer(payment).data
        })


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
    

class ZarinpalRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("order_id")

        try:
            order = Orders.objects.get(id=order_id, user=request.user)
        except Orders.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        amount = order.total_amount  # ریال

        payment = Payments.objects.create(
            order=order,
            gateway="Zarinpal",
            status="pending"
        )

        data = {
            "merchant_id": settings.ZARINPAL_MERCHANT_ID,
            "amount": amount,
            "callback_url": settings.ZARINPAL_CALLBACK_URL,
            "description": f"پرداخت سفارش شماره {order.id}",
        }

        response = requests.post(
            "https://sandbox.zarinpal.com/pg/v4/payment/request.json",
            json=data
        ).json()

        if response["data"]["code"] == 100:
            authority = response["data"]["authority"]
            payment.authority = authority
            payment.save()

            return Response({
                "payment_url": f"https://sandbox.zarinpal.com/pg/StartPay/{authority}",
                "payment_id": payment.id
            })

        return Response({"error": "Zarinpal request failed", "details": response})

class ZarinpalVerify(APIView):

    def get(self, request):
        authority = request.GET.get("Authority")
        status = request.GET.get("Status")

        try:
            payment = Payments.objects.get(authority=authority)
        except Payments.DoesNotExist:
            return Response({"error": "Payment not found"}, status=404)

        if status != "OK":
            payment.status = "failed"
            payment.save()
            return Response({"message": "Payment failed"})

        data = {
            "merchant_id": settings.ZARINPAL_MERCHANT_ID,
            "amount": payment.order.total_amount,
            "authority": authority
        }

        response = requests.post(
            "https://sandbox.zarinpal.com/pg/v4/payment/verify.json",
            json=data
        ).json()

        if response["data"]["code"] == 100:
            payment.status = "success"
            payment.ref_id = response["data"]["ref_id"]
            payment.paid_at = timezone.now()
            payment.save()

            order = payment.order
            order.status = "paid"
            order.paid_at = timezone.now()
            order.save()

            return Response({"message": "Payment successful", "ref_id": payment.ref_id})

        payment.status = "failed"
        payment.save()
        return Response({"message": "Payment failed", "details": response})
