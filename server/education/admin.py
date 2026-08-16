from django.contrib import admin
from .models import News, Tutorial ,NewsGallery, TutorialGallery

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "publish_date")
    search_fields = ("title", "description")


@admin.register(Tutorial)
class TutorialAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "publish_date")
    search_fields = ("title", "description")


@admin.register(NewsGallery)
class NewsGalleryAdmin(admin.ModelAdmin):
    list_display = ("id", "news", "image", "created_at")

@admin.register(TutorialGallery)
class TutorialGalleryAdmin(admin.ModelAdmin):
    list_display = ("id", "tutorial", "image", "created_at")