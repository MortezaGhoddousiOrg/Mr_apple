from django.urls import path
from .views import (
    AdminOrderListView,
    AdminOrderUpdateView,
    CartView,
    AddToCart,
    MyOrderDetailView,
    MyOrdersView,
    RemoveFromCart,
    UpdateQuantity,
    CreateOrder,
    UpdatePayment,
    ZarinpalVerify
)

urlpatterns = [

    # CART
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/add/", AddToCart.as_view(), name="add_to_cart"),
    path("cart/remove/", RemoveFromCart.as_view(), name="remove_from_cart"),
    path("cart/update/", UpdateQuantity.as_view(), name="update_quantity"),

    # ORDERS
    path("create/", CreateOrder.as_view(), name="create_order"),

    # PAYMENTS (internal)
    # path("payments/create/", CreatePayment.as_view(), name="create_payment"),
    path("payments/update/", UpdatePayment.as_view(), name="update_payment"),

    # ZARINPAL
    # path("payments/zarinpal/request/", ZarinpalRequest.as_view(), name="zarinpal_request"),
    path("payments/zarinpal/verify/", ZarinpalVerify.as_view(), name="zarinpal_verify"),
    
    # ADMIN
    path("admin/", AdminOrderListView.as_view(), name="admin_order_list"),
    path("admin/<int:order_id>/", AdminOrderUpdateView.as_view(), name="admin_order_update"),
    
    #My-ORDERS
    path("my-orders/", MyOrdersView.as_view()),
    path("my-orders/<int:order_id>/", MyOrderDetailView.as_view()),
]
