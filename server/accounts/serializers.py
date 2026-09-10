from rest_framework import serializers
from authuser.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "firstname",
            "lastname",
            "phone",
            "email",
            "is_staff",
            "is_active",
            "created_at",
        ]
        extra_kwargs = {
            'phone': {'required': True},
            'firstname': {'required': True},
            'lastname': {'required': True},
        }
