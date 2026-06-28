from rest_framework_simplejwt.authentication import JWTAuthentication


class UserJWTAuthentication(JWTAuthentication):

    def authenticate(self, request):
        token = request.COOKIES.get("access_token")

        if not token:
            return None

        try:
            validated_token = self.get_validated_token(token)
            user = self.get_user(validated_token)

            # ادمین اجازه ورود به بخش کاربری ندارد
            if user.is_staff:
                return None

            return user, validated_token

        except Exception:
            return None

class AdminJWTAuthentication(JWTAuthentication):

    def authenticate(self, request):
        token = request.COOKIES.get("admin_access_token")

        if not token:
            return None

        try:
            validated_token = self.get_validated_token(token)
            user = self.get_user(validated_token)

            # فقط ادمین اجازه دارد
            if not user.is_staff:
                return None

            return user, validated_token

        except Exception:
            return None