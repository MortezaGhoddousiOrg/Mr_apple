import random
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import authenticate, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import OTP
from .serializers import AdminLoginSerializer, SendCodeSerializer, VerifyCodeSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import AccessToken




User = get_user_model()


class SendCodeView(APIView):
    def post(self, request):
        serializer = SendCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data["phone"]

        # code = str(random.randint(100000, 999999))
        code = "123456"
        expires_at = timezone.now() + timedelta(minutes=1)

        OTP.objects.create(
            phone=phone,
            code=code,
            expires_at=expires_at
        )

        print("OTP:", code)

        return Response({"message": "کد ارسال شد"})


class VerifyCodeView(APIView):
    def post(self, request):
        serializer = VerifyCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data["phone"]
        code = serializer.validated_data["code"]

        otp = OTP.objects.filter(phone=phone).order_by("-created_at").first()

        if not otp:
            return Response({"error": "کد یافت نشد"}, status=400)

        if otp.code != code:
            return Response({"error": "کد اشتباه است"}, status=400)

        if not otp.is_valid():
            return Response({"error": "کد منقضی شده"}, status=400)

        user, created = User.objects.get_or_create(phone=phone)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response({"message": "ورود موفق" , "access_token": access_token})

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=60 * 60 * 24 * 7,
        )

        return response
    


class AdminLoginView(APIView):
    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]

        user = authenticate(request, username=username, password=password)

        if not user:
            return Response({"error": "یوزرنیم یا پسورد اشتباه است"}, status=400)

        if not user.is_staff:
            return Response({"error": "دسترسی ادمین ندارید"}, status=403)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response({"message": "ورود ادمین موفق"})

        response.set_cookie(
            key="admin_access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=60 * 60 * 24 * 7,
        )

        return response

class MeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        access_token = request.COOKIES.get("access_token")
        admin_token = request.COOKIES.get("admin_access_token")

        token = access_token or admin_token

        if not token:
            return Response({"error": "کاربر لاگین نیست"}, status=401)

        try:
            decoded = AccessToken(token)
            user_id = decoded["user_id"]
        except Exception:
            return Response({"error": "توکن نامعتبر یا منقضی شده"}, status=401)

        user = User.objects.get(id=user_id)

        return Response({
            "id": user.id,
            "phone": user.phone,
            "username": user.username,
            "firstname": user.firstname,
            "lastname": user.lastname,
            "email": user.email,
            "is_staff": user.is_staff,
        })
