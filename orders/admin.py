from django.contrib import admin
from .models import Orders, OrderItems, Payments, Cart

admin.site.register(Orders)
admin.site.register(OrderItems)
admin.site.register(Payments)
admin.site.register(Cart)