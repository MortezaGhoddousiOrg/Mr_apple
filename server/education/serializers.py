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

    # 🔥 آی‌دی‌های تصاویر گالری‌ای که از قبل و مستقل از خبر آپلود شده‌اند
    # (از طریق /education/admin/news-gallery/upload/) و باید به این خبر
    # متصل شوند.
    gallery_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        allow_empty=True,
    )

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
            "gallery_ids",
            "tags",
            "created_at",
            "updated_at",
        ]

    def get_image(self, obj):
        if obj.image:
            return obj.image.image.url
        return None

    def create(self, validated_data):
        gallery_ids = validated_data.pop("gallery_ids", None)
        image_id = validated_data.pop("image_id", None)
        if image_id:
            try:
                validated_data["image"] = EducationImages.objects.get(id=image_id)
            except EducationImages.DoesNotExist:
                raise serializers.ValidationError({"image_id": "Invalid image_id"})

        instance = super().create(validated_data)

        if gallery_ids:
            NewsGallery.objects.filter(id__in=gallery_ids).update(news=instance)

        return instance

    def update(self, instance, validated_data):
        gallery_ids = validated_data.pop("gallery_ids", None)
        image_id = validated_data.pop("image_id", None)
        if image_id:
            try:
                instance.image = EducationImages.objects.get(id=image_id)
            except EducationImages.DoesNotExist:
                raise serializers.ValidationError({"image_id": "Invalid image_id"})

        instance = super().update(instance, validated_data)

        if gallery_ids is not None:
            # هرچی قبلاً به این خبر وصل بود ولی دیگه توی لیست جدید نیست، جدا می‌شود
            NewsGallery.objects.filter(news=instance).exclude(id__in=gallery_ids).update(news=None)
            # هرچی توی لیست جدیده وصل/به‌روز می‌شود
            NewsGallery.objects.filter(id__in=gallery_ids).update(news=instance)

        return instance


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
            "tags",
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