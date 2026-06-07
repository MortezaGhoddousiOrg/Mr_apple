from django.urls import path
from .views import (
    CategoryParentList,
    CategoryParentDetail,
    CategoryChildList,
    CategoryChildDetail,
    category_detail_with_related,
)

urlpatterns = [
    path("parent/", CategoryParentList.as_view()),
    path("parent/<int:pk>/", CategoryParentDetail.as_view()),

    path("child/", CategoryChildList.as_view()),
    path("child/<int:pk>/", CategoryChildDetail.as_view()),

    path("category-child/<int:pk>/detail/", category_detail_with_related),
]