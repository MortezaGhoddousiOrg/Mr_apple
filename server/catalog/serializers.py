from rest_framework import serializers
from .models import Products, ProductImages, ProductVariant
from category.serializers import CategoryChildSerializer


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImages
        fields = "__all__"


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "color",
            "duration_months",
            "condition",
            "warranty",
            "price",
            "quantity",
            "is_active",
        ]


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    category = CategoryChildSerializer(source="category_id", read_only=True)

    category_id = serializers.IntegerField(write_only=True, required=False)

    image_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        allow_empty=True
    )

    deleted_image_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        allow_empty=True
    )

    main_image_id = serializers.IntegerField(
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Products
        fields = "__all__"

    def validate_category_id(self, value):
        from category.models import CategoryChild
        if value and not CategoryChild.objects.filter(id=value).exists():
            raise serializers.ValidationError("Invalid category_id")
        return value

    def create(self, validated_data):
        validated_data.pop("image_ids", None)
        validated_data.pop("deleted_image_ids", None)
        validated_data.pop("main_image_id", None)

        category_id = validated_data.pop("category_id", None)

        product = Products.objects.create(
            **validated_data,
            category_id_id=category_id
        )

        return product

    def update(self, instance, validated_data):
        validated_data.pop("image_ids", None)
        validated_data.pop("deleted_image_ids", None)
        validated_data.pop("main_image_id", None)

        category_id = validated_data.pop("category_id", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if category_id is not None:
            instance.category_id_id = category_id

        instance.save()
        return instance
