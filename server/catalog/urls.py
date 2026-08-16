from django.urls import path
from .views import (
    ProductSearchView,
    product_list,
    product_by_child,
    product_latest,
    product_home_list,
    UploadProductImage,
    DeleteProductImage,
    ProductCreateView,
    ProductUpdateDeleteView,
    VariantCreateView,
    VariantUpdateDeleteView,
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

    # SEARCH
    path("products/search/", ProductSearchView.as_view()),

    # VARIANTS
    path("product/<int:product_id>/variant/create/", VariantCreateView.as_view()),
    path("variant/<int:variant_id>/", VariantUpdateDeleteView.as_view()),
]
