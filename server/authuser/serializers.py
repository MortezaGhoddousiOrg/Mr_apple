from rest_framework import serializers


class SendCodeSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=11)


class VerifyCodeSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=11)
    code = serializers.CharField(max_length=6)


class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()