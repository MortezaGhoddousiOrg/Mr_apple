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
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserProfileSerializer



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

        response = Response({
            "message": "ورود موفق",
            "access_token": access_token,
            "is_new_user": created,
            "profile_completed": user.profile_completed,
            "user": {
                "id": user.id,
                "phone": user.phone,
                "username": user.username,
                "firstname": user.firstname,
                "lastname": user.lastname,
                "email": user.email,
            }
        })

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

    # /auth/me
    def get_user_from_token(self, request):
        access_token = request.COOKIES.get("access_token")
        admin_token = request.COOKIES.get("admin_access_token")

        token = access_token or admin_token

        if not token:
            return None

        try:
            decoded = AccessToken(token)
            user_id = decoded["user_id"]

            return User.objects.get(id=user_id)

        except User.DoesNotExist:
            return None

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
        })

    def put(self, request):
        user = self.get_user_from_token(request)

        if not user:
            return Response(
                {"error": "کاربر لاگین نیست"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        user.username = request.data.get(
            "username",
            user.username
        )

        user.firstname = request.data.get(
            "firstname",
            user.firstname
        )

        user.lastname = request.data.get(
            "lastname",
            user.lastname
        )

        user.email = request.data.get(
            "email",
            user.email
        )
        user.postal_code = request.data.get(
            "postal_code",
            user.postal_code
        )
        
        user.address = request.data.get(
            "address",
            user.address
        )

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