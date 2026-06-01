from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone
from .models import Orders, OrderItems, Payments, Cart
from .serializers import (
    OrderSerializer,
    OrderItemSerializer,
    PaymentSerializer,
    CartSerializer
)

from catalog.models import Products
import requests
from django.conf import settings
from django.utils import timezone

# CART 

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        cart_items = Cart.objects.filter(user=user)

        items_data = []
        total_amount = 0
        total_quantity = 0

        for item in cart_items:
            product = item.product
            item_total = product.price * item.quantity

            items_data.append({
                "product_id": product.id,
                "title": product.title,
                "price": product.price,
                "quantity": item.quantity,
                "total_price": item_total
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
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        try:
            product = Products.objects.get(id=product_id)
        except Products.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        cart_item, created = Cart.objects.get_or_create(
            user=user,
            product=product
        )

        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity

        cart_item.save()

        return Response({"message": "Added to cart"})


class RemoveFromCart(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        product_id = request.data.get("product_id")

        try:
            item = Cart.objects.get(user=user, product_id=product_id)
            item.delete()
            return Response({"message": "Removed from cart"})
        except Cart.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)


# CREATE ORDER (ساخت سفارش)

class CreateOrder(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        cart_items = Cart.objects.filter(user=user)

        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        total_amount = 0

        for item in cart_items:
            total_amount += item.product.price * item.quantity


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
                price=item.product.price
            )

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
