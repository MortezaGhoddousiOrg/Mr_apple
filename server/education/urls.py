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

    # UPLOAD GALLERY IMAGE (attached directly to an existing news_id)
    NewsGalleryUploadView,

    # 🔥 UPLOAD / DELETE GALLERY IMAGE (decoupled, no news_id needed yet)
    UploadNewsGalleryImage,
    DeleteNewsGalleryImage,

    # UPLOAD GALLERY IMAGE (attached directly to an existing tutorial_id)
    TutorialGalleryUploadView,

    # 🔥 UPLOAD / DELETE GALLERY IMAGE (decoupled, no tutorial_id needed yet)
    UploadTutorialGalleryImage,
    DeleteTutorialGalleryImage,
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
    # UPLOAD GALLERY IMAGE (attached to an existing news item)
    # -----------------------------
    path("admin/news/<int:news_id>/gallery/upload/", NewsGalleryUploadView.as_view()),

    # -----------------------------
    # 🔥 UPLOAD / DELETE GALLERY IMAGE (decoupled - like the main image)
    # -----------------------------
    path("admin/news-gallery/upload/", UploadNewsGalleryImage.as_view()),
    path("admin/news-gallery/<int:image_id>/", DeleteNewsGalleryImage.as_view()),

    # -----------------------------
    # UPLOAD GALLERY IMAGE (attached to an existing tutorial item)
    # -----------------------------
    path("admin/tutorials/<int:tutorial_id>/gallery/upload/", TutorialGalleryUploadView.as_view()),

    # -----------------------------
    # 🔥 UPLOAD / DELETE GALLERY IMAGE (decoupled - like the main image)
    # -----------------------------
    path("admin/tutorial-gallery/upload/", UploadTutorialGalleryImage.as_view()),
    path("admin/tutorial-gallery/<int:image_id>/", DeleteTutorialGalleryImage.as_view()),
]