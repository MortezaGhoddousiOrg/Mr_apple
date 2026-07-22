from django.urls import path
from .views import (
    NewsListView,
    NewsDetailView,
    NewsAdminView,
    TutorialListView,
    TutorialDetailView,
    TutorialAdminView,
    UploadEducationImage,
)

urlpatterns = [
    # PUBLIC
    path("news/", NewsListView.as_view()),
    path("news/<int:item_id>/", NewsDetailView.as_view()),
    path("tutorials/", TutorialListView.as_view()),
    path("tutorials/<int:item_id>/", TutorialDetailView.as_view()),

    # ADMIN
    path("admin/news/", NewsAdminView.as_view()),
    path("admin/news/<int:item_id>/", NewsAdminView.as_view()),
    path("admin/tutorials/", TutorialAdminView.as_view()),
    path("admin/tutorials/<int:item_id>/", TutorialAdminView.as_view()),
    path("admin/upload-image/", UploadEducationImage.as_view()),
]
