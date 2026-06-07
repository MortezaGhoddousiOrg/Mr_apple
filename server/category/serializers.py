from rest_framework import serializers
from .models import CategoryParent, CategoryChild


class CategoryParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryParent
        fields = "__all__"


class CategoryChildSerializer(serializers.ModelSerializer):
    parent = CategoryParentSerializer(read_only=True)
    parent_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CategoryChild
        fields = "__all__"

    def create(self, validated_data):
        parent_id = validated_data.pop("parent_id")
        parent = CategoryParent.objects.get(id=parent_id)
        return CategoryChild.objects.create(parent=parent, **validated_data)

    def update(self, instance, validated_data):
        parent_id = validated_data.pop("parent_id", None)
        if parent_id:
            instance.parent = CategoryParent.objects.get(id=parent_id)
        return super().update(instance, validated_data)