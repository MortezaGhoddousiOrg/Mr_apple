from rest_framework import serializers
from .models import News, Tutorial, EducationImages


class EducationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationImages
        fields = ["id", "image", "created_at"]


class NewsSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    image_id = serializers.SerializerMethodField()

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
            "created_at",
            "updated_at"
        ]

    def get_image(self, obj):
        if obj.image:
            return obj.image.image.url
        return None

    def get_image_id(self, obj):
        if obj.image:
            return obj.image.id
        return None

    def create(self, validated_data):
        image_id = validated_data.pop('image_id', None)
        if image_id:
            try:
                image = EducationImages.objects.get(id=image_id)
                validated_data['image'] = image
            except EducationImages.DoesNotExist:
                pass
        return super().create(validated_data)

    def update(self, instance, validated_data):
        image_id = validated_data.pop('image_id', None)
        if image_id:
            try:
                image = EducationImages.objects.get(id=image_id)
                instance.image = image
            except EducationImages.DoesNotExist:
                pass
        return super().update(instance, validated_data)


class TutorialSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    image_id = serializers.SerializerMethodField()

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
            "updated_at"
        ]

    def get_image(self, obj):
        if obj.image:
            return obj.image.image.url
        return None

    def get_image_id(self, obj):
        if obj.image:
            return obj.image.id
        return None

    def create(self, validated_data):
        image_id = validated_data.pop('image_id', None)
        if image_id:
            try:
                image = EducationImages.objects.get(id=image_id)
                validated_data['image'] = image
            except EducationImages.DoesNotExist:
                pass
        return super().create(validated_data)

    def update(self, instance, validated_data):
        image_id = validated_data.pop('image_id', None)
        if image_id:
            try:
                image = EducationImages.objects.get(id=image_id)
                instance.image = image
            except EducationImages.DoesNotExist:
                pass
        return super().update(instance, validated_data)