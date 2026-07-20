from rest_framework import serializers
from .models import News, Tutorial


class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = [
            "id",
            "title",
            "description",
            "image",
            "publish_date",
            "created_at",
            "updated_at",
        ]


class TutorialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tutorial
        fields = [
            "id",
            "title",
            "description",
            "image",
            "publish_date",
            "created_at",
            "updated_at",
        ]
