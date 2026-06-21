from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Orders(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    total_amount = models.IntegerField()
    status = models.TextField(null=True, blank=True)
    product_status = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "orders"

    def __str__(self):
        return f"Order {self.id} - User {self.user_id}"


class OrderItems(models.Model):
    order = models.ForeignKey(Orders, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("catalog.Products", on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.IntegerField()

    class Meta:
        db_table = "order_items"

    def __str__(self):
        return f"OrderItem {self.id} - Order {self.order_id}"


class Payments(models.Model):
    order = models.ForeignKey(Orders, on_delete=models.CASCADE, related_name="payments")
    gateway = models.TextField(default="Zarinpal")
    ref_id = models.TextField(null=True, blank=True)
    sale_reference_id = models.TextField(null=True, blank=True)
    res_code = models.TextField(null=True, blank=True)
    status = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    authority = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    class Meta:
        db_table = "payments"

    def __str__(self):
        return f"Payment {self.id} - Order {self.order_id}"


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart")
    product = models.ForeignKey("catalog.Products", on_delete=models.CASCADE)
    quantity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "cart"
        constraints = [
            models.UniqueConstraint(fields=["user", "product"], name="unique_user_product_cart")
        ]

    def __str__(self):
        return f"Cart {self.id} - User {self.user_id}"
    