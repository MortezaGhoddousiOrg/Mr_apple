import random
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import authenticate, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .models import OTP
from .serializers import (
    AdminLoginSerializer,
    SendCodeSerializer,
    VerifyCodeSerializer,
)

User = get_user_model()


# -----------------------------
# SEND OTP
# -----------------------------
class SendCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data["phone"]

        # code = str(random.randint(100000, 999999))
        code = "123456"
        expires_at = timezone.now() + timedelta(minutes=1)

        OTP.objects.filter(phone=phone).delete()

        OTP.objects.create(
            phone=phone,
            code=code,
            expires_at=expires_at
        )

        print("OTP:", code)

        return Response({"message": "کد ارسال شد"}, status=status.HTTP_200_OK)


# -----------------------------
# VERIFY OTP (USER LOGIN)
# -----------------------------
class VerifyCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data["phone"]
        code = serializer.validated_data["code"]

        otp = OTP.objects.filter(phone=phone).order_by("-created_at").first()

        if not otp:
            return Response({"error": "کد یافت نشد"}, status=status.HTTP_400_BAD_REQUEST)

        if otp.code != code:
            return Response({"error": "کد اشتباه است"}, status=status.HTTP_400_BAD_REQUEST)

        if not otp.is_valid():
            return Response({"error": "کد منقضی شده"}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(phone=phone)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response({
            "message": "ورود موفق",
            "is_new_user": created,
            "profile_completed": getattr(user, "profile_completed", False),
            "user": {
                "id": user.id,
                "phone": user.phone,
                "username": user.username,
                "firstname": getattr(user, "firstname", ""),
                "lastname": getattr(user, "lastname", ""),
                "email": user.email,
            }
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=60 * 60 * 24 * 7,
        )

        return response


# -----------------------------
# ADMIN LOGIN
# -----------------------------
class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]

        user = authenticate(request, username=username, password=password)

        if not user:
            return Response(
                {"error": "یوزرنیم یا پسورد اشتباه است"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.is_staff:
            return Response(
                {"error": "دسترسی ادمین ندارید"},
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response({"message": "ورود ادمین موفق"}, status=status.HTTP_200_OK)

        response.set_cookie(
            key="admin_access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=60 * 60 * 24 * 7,
        )

        return response


# -----------------------------
# USER PROFILE (ONLY CLIENT)
# -----------------------------
class MeView(APIView):
    permission_classes = [AllowAny]

    def get_user_from_token(self, request):
        token = request.COOKIES.get("access_token")

        if not token:
            return None

        try:
            decoded = AccessToken(token)
            user_id = decoded["user_id"]
            user = User.objects.get(id=user_id)

            # جلوگیری از استفاده ادمین از این endpoint
            if user.is_staff:
                return None

            return user

        except Exception:
            return None

    def get(self, request):
        user = self.get_user_from_token(request)

        if not user:
            return Response(
                {"error": "کاربر لاگین نیست"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        return Response({
            "id": user.id,
            "phone": user.phone,
            "username": user.username,
            "firstname": user.firstname,
            "lastname": user.lastname,
            "email": user.email,
            "postal_code": user.postal_code,
            "address": user.address,
            "is_staff": user.is_staff,
        }, status=status.HTTP_200_OK)

    def put(self, request):
        user = self.get_user_from_token(request)

        if not user:
            return Response(
                {"error": "کاربر لاگین نیست"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        user.username = request.data.get("username", user.username)
        user.firstname = request.data.get("firstname", user.firstname)
        user.lastname = request.data.get("lastname", user.lastname)
        user.email = request.data.get("email", user.email)
        user.postal_code = request.data.get("postal_code", user.postal_code)
        user.address = request.data.get("address", user.address)

        user.save()

        return Response(
            {
                "message": "اطلاعات با موفقیت ویرایش شد",
                "data": {
                    "id": user.id,
                    "phone": user.phone,
                    "username": user.username,
                    "firstname": user.firstname,
                    "lastname": user.lastname,
                    "email": user.email,
                    "postal_code": user.postal_code,
                    "address": user.address,
                    "is_staff": user.is_staff,
                }
            },
            status=status.HTTP_200_OK
        )


# -----------------------------
# LOGOUT USER
# -----------------------------
class LogoutView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        response = Response(
            {"message": "خروج موفق"},
            status=status.HTTP_200_OK
        )

        response.delete_cookie("access_token")
        return response


# -----------------------------
# LOGOUT ADMIN
# -----------------------------
class LogoutAdminView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        response = Response(
            {"message": "خروج موفق"},
            status=status.HTTP_200_OK
        )

        response.delete_cookie("admin_access_token")
        return response


# -----------------------------
# ADMIN PROFILE (ONLY ADMIN)
# -----------------------------
class AdminMeView(APIView):
    permission_classes = [AllowAny]

    def get_admin_from_token(self, request):
        token = request.COOKIES.get("admin_access_token")

        if not token:
            return None

        try:
            decoded = AccessToken(token)
            user_id = decoded["user_id"]
            user = User.objects.get(id=user_id)

            if not user.is_staff:
                return None

            return user

        except Exception:
            return None

    def get(self, request):
        user = self.get_admin_from_token(request)

        if not user:
            return Response(
                {"error": "ادمین لاگین نیست یا دسترسی ندارد"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        return Response({
            "id": user.id,
            "username": user.username,
            "firstname": user.firstname,
            "lastname": user.lastname,
            "email": user.email,
            "phone": user.phone,
            "is_staff": user.is_staff,
        }, status=status.HTTP_200_OK)
