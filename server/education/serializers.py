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
        # ✅ اضافه کردن extra_kwargs برای پذیرش image_id در ورودی
        extra_kwargs = {
            'image_id': {
                'required': False,
                'allow_null': True,
                'write_only': True  # فقط برای ورودی، در خروجی توسط get_image_id نمایش داده میشه
            }
        }

    def get_image(self, obj):
        if obj.image:
            return obj.image.image.url
        return None

    def get_image_id(self, obj):
        if obj.image:
            return obj.image.id
        return None

    def to_internal_value(self, data):
        """
        این متد باعث میشه image_id به validated_data اضافه بشه
        """
        print(f"=== NewsSerializer.to_internal_value ===")
        print(f"data received: {data}")
        
        # image_id رو از data بگیر و به validated_data اضافه کن
        if 'image_id' in data:
            self._image_id = data.get('image_id')
            print(f"image_id stored: {self._image_id}")
        else:
            self._image_id = None
        
        return super().to_internal_value(data)

    def create(self, validated_data):
        print("=== NewsSerializer.create CALLED ===")
        print(f"validated_data before pop: {validated_data}")
        
        # image_id رو از validated_data بگیر
        # چون extra_kwargs write_only=True هست، باید از self._image_id استفاده کنیم
        image_id = getattr(self, '_image_id', None)
        print(f"image_id from self: {image_id}")
        
        if image_id:
            try:
                image = EducationImages.objects.get(id=image_id)
                validated_data['image'] = image
                print(f"✅ Image found and assigned: {image.id}")
            except EducationImages.DoesNotExist:
                print(f"❌ Image with id {image_id} not found!")
        else:
            print("⚠️ No image_id provided")
        
        print(f"validated_data after processing: {validated_data}")
        return super().create(validated_data)

    def update(self, instance, validated_data):
        print("=== NewsSerializer.update CALLED ===")
        print(f"validated_data before pop: {validated_data}")
        
        image_id = getattr(self, '_image_id', None)
        print(f"image_id from self: {image_id}")
        
        if image_id:
            try:
                image = EducationImages.objects.get(id=image_id)
                instance.image = image
                print(f"✅ Image found and assigned: {image.id}")
            except EducationImages.DoesNotExist:
                print(f"❌ Image with id {image_id} not found!")
        else:
            print("⚠️ No image_id provided")
        
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
        extra_kwargs = {
            'image_id': {
                'required': False,
                'allow_null': True,
                'write_only': True
            }
        }

    def get_image(self, obj):
        if obj.image:
            return obj.image.image.url
        return None

    def get_image_id(self, obj):
        if obj.image:
            return obj.image.id
        return None

    def to_internal_value(self, data):
        print(f"=== TutorialSerializer.to_internal_value ===")
        print(f"data received: {data}")
        
        if 'image_id' in data:
            self._image_id = data.get('image_id')
            print(f"image_id stored: {self._image_id}")
        else:
            self._image_id = None
        
        return super().to_internal_value(data)

    def create(self, validated_data):
        print("=== TutorialSerializer.create CALLED ===")
        print(f"validated_data before pop: {validated_data}")
        
        image_id = getattr(self, '_image_id', None)
        print(f"image_id from self: {image_id}")
        
        if image_id:
            try:
                image = EducationImages.objects.get(id=image_id)
                validated_data['image'] = image
                print(f"✅ Image found and assigned: {image.id}")
            except EducationImages.DoesNotExist:
                print(f"❌ Image with id {image_id} not found!")
        else:
            print("⚠️ No image_id provided")
        
        print(f"validated_data after processing: {validated_data}")
        return super().create(validated_data)

    def update(self, instance, validated_data):
        print("=== TutorialSerializer.update CALLED ===")
        print(f"validated_data before pop: {validated_data}")
        
        image_id = getattr(self, '_image_id', None)
        print(f"image_id from self: {image_id}")
        
        if image_id:
            try:
                image = EducationImages.objects.get(id=image_id)
                instance.image = image
                print(f"✅ Image found and assigned: {image.id}")
            except EducationImages.DoesNotExist:
                print(f"❌ Image with id {image_id} not found!")
        else:
            print("⚠️ No image_id provided")
        
        return super().update(instance, validated_data)