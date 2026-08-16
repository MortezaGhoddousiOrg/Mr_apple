from django.urls import path
from .views import (
    # PUBLIC
    NewsListView,
    NewsDetailView,
    TutorialListView,
    TutorialDetailView,

    # ADMIN
    NewsAdminView,
    TutorialAdminView,

    # UPLOAD MAIN IMAGE
    UploadEducationImageView,

    # UPLOAD GALLERY IMAGE
    NewsGalleryUploadView,
)

urlpatterns = [
    # -----------------------------
    # PUBLIC
    # -----------------------------
    path("news/", NewsListView.as_view()),
    path("news/<int:item_id>/", NewsDetailView.as_view()),

    path("tutorials/", TutorialListView.as_view()),
    path("tutorials/<int:item_id>/", TutorialDetailView.as_view()),

    # -----------------------------
    # ADMIN CRUD
    # -----------------------------
    path("admin/news/", NewsAdminView.as_view()),
    path("admin/news/<int:item_id>/", NewsAdminView.as_view()),

    path("admin/tutorials/", TutorialAdminView.as_view()),
    path("admin/tutorials/<int:item_id>/", TutorialAdminView.as_view()),

    # -----------------------------
    # UPLOAD MAIN IMAGE
    # -----------------------------
    path("admin/upload-image/", UploadEducationImageView.as_view()),

    # -----------------------------
    # UPLOAD GALLERY IMAGE
    # -----------------------------
    path("admin/news/<int:news_id>/gallery/upload/", NewsGalleryUploadView.as_view()),
]
