from django.urls import path
from .views import (
    category_parent_list,
    category_child_list,
    category_detail_with_related,
    CategoryParentAdmin,
    CategoryChildAdmin,
)

urlpatterns = [
    # PUBLIC
    path("parent/", category_parent_list),
    path("child/", category_child_list),
    path("category-child/<int:pk>/detail/", category_detail_with_related),

    # ⚠️ فقط یک بار ثبت شده - این ویو الان هم GET عمومی (تک آیتم) و هم
    # PUT/DELETE ادمین رو خودش مدیریت می‌کنه (با get_permissions).
    # قبلاً یه بار به category_child_detail (GET-only) و یه بار به
    # CategoryChildAdmin اشاره می‌کرد که باعث می‌شد اولین‌ (GET-only)
    # همیشه برنده بشه و PUT/DELETE با 405 رد بشن.
    path("child/<int:pk>/", CategoryChildAdmin.as_view()),

    # ADMIN CRUD (FRONTEND COMPATIBLE)
    path("parent/<int:pk>/", CategoryParentAdmin.as_view()),

    # OLD ADMIN ROUTES (KEEP THEM)
    path("admin/parent/", CategoryParentAdmin.as_view()),
    path("admin/child/", CategoryChildAdmin.as_view()),
]