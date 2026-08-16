from rest_framework import serializers
from .models import News, NewsGallery, Tutorial, EducationImages


class EducationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationImages
        fields = ["id", "image", "created_at"]


class NewsGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsGallery
        fields = ["id", "image"]


class NewsSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    image_id = serializers.IntegerField(write_only=True, required=False)
    gallery = NewsGallerySerializer(many=True, read_only=True)

    class Meta:
        model = News
        fields = [
            "id",
            "title",
            "description",
            "publish_date",
            "type",
            "image",
            "image_id",
            "gallery",
            "created_at",
            "updated_at",
        ]

    def get_image(self, obj):
        if obj.image:
            return obj.image.image.url
        return None

    def create(self, validated_data):
        image_id = validated_data.pop("image_id", None)
        if image_id:
            try:
                validated_data["image"] = EducationImages.objects.get(id=image_id)
            except EducationImages.DoesNotExist:
                raise serializers.ValidationError({"image_id": "Invalid image_id"})
        return super().create(validated_data)

    def update(self, instance, validated_data):
        image_id = validated_data.pop("image_id", None)
        if image_id:
            try:
                instance.image = EducationImages.objects.get(id=image_id)
            except EducationImages.DoesNotExist:
                raise serializers.ValidationError({"image_id": "Invalid image_id"})
        return super().update(instance, validated_data)


class TutorialSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    image_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Tutorial
        fields = [
            "id",
            "title",
            "description",
            "publish_date",
            "type",
            "image",
            "image_id",
            "created_at",
            "updated_at",
        ]

    def get_image(self, obj):
        if obj.image:
            return obj.image.image.url
        return None

    def create(self, validated_data):
        image_id = validated_data.pop("image_id", None)
        if image_id:
            try:
                validated_data["image"] = EducationImages.objects.get(id=image_id)
            except EducationImages.DoesNotExist:
                raise serializers.ValidationError({"image_id": "Invalid image_id"})
        return super().create(validated_data)

    def update(self, instance, validated_data):
        image_id = validated_data.pop("image_id", None)
        if image_id:
            try:
                instance.image = EducationImages.objects.get(id=image_id)
            except EducationImages.DoesNotExist:
                raise serializers.ValidationError({"image_id": "Invalid image_id"})
        return super().update(instance, validated_data)
