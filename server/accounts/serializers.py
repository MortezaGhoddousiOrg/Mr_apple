from rest_framework import serializers
from .models import Users

class UserSerializer(serializers.ModelSerializer):
    is_active = serializers.SerializerMethodField()
    is_staff = serializers.SerializerMethodField()

    class Meta:
        model = Users
        fields = "__all__"
        extra_kwargs = {
            'phone': {'required': True},
            'firstname': {'required': True},
            'lastname': {'required': True},
        }

    def get_is_active(self, obj):
        return obj.status == "active"

    def get_is_staff(self, obj):
        return obj.role == "admin"