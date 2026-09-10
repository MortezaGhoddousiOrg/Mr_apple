from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed


class UserJWTAuthentication(JWTAuthentication):
    """
    احراز هویت کاربران معمولی
    فقط کوکی access_token بررسی می‌شود
    """

    def authenticate(self, request):
        token = request.COOKIES.get("access_token")

        if not token:
            return None

        try:
            validated_token = self.get_validated_token(token)
            user = self.get_user(validated_token)

            # اگر یوزر ادمین بود، برای endpointهای عمومی اصلاً احراز هویت نشه
            if user.is_staff:
                return None

            return user, validated_token

        except Exception:
            return None




class AdminJWTAuthentication(JWTAuthentication):
    """
    احراز هویت ادمین
    فقط کوکی admin_access_token بررسی می‌شود
    کاربر معمولی اجازه ورود به بخش ادمین ندارد
    """

    def authenticate(self, request):
        token = request.COOKIES.get("admin_access_token")

        if not token:
            return None

        try:
            validated_token = self.get_validated_token(token)
            user = self.get_user(validated_token)

            # جلوگیری از ورود کاربر معمولی به بخش ادمین
            if not user.is_staff:
                raise AuthenticationFailed("Only admins can access admin endpoints")

            return user, validated_token

        except Exception:
            return None
