from django.contrib import admin
from .models import News, Tutorial

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "publish_date")
    search_fields = ("title", "description")


@admin.register(Tutorial)
class TutorialAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "publish_date")
    search_fields = ("title", "description")
