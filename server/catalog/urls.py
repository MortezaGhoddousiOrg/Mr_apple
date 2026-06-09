from django.urls import path
from .views import (
    product_list,
    product_by_child,
    product_latest,
    product_home_list,
    UploadProductImage,
    DeleteProductImage,
    ProductCreateView,
    ProductUpdateDeleteView,
)

urlpatterns = [

    # PRODUCT LISTS
    path("product/", product_list),
    path("product/child/<int:child_id>/", product_by_child),
    path("product/latest/", product_latest),

    # HOME PAGE
    path("product/home/", product_home_list),

    # PRODUCT CREATE
    path("product/create/", ProductCreateView.as_view()),

    # PRODUCT UPDATE & DELETE
    path("product/<int:product_id>/", ProductUpdateDeleteView.as_view()),

    # PRODUCT IMAGES
    path("product/image/upload/", UploadProductImage.as_view()),
    path("product/image/<int:image_id>/", DeleteProductImage.as_view()),
]
