from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class SendCodeSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=11)


class VerifyCodeSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=11)
    code = serializers.CharField(max_length=6)


class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "phone",
            "username",
            "firstname",
            "lastname",
            "email",
            "postal_code",
            "national_id",
            "address",
            "is_staff",
        ]
        read_only_fields = [
            "id",
            "phone",
            "is_staff",
        ]