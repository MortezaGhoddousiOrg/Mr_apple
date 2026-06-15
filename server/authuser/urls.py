from django.urls import path
from .views import (
    AdminMeView,
    MeView,
    SendCodeView,
    VerifyCodeView,
    AdminLoginView,
    LogoutView,
)

urlpatterns = [
    path("send-code/", SendCodeView.as_view()),
    path("verify-code/", VerifyCodeView.as_view()),
    path("admin/login/", AdminLoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("me/", MeView.as_view()),
    path("admin/me/", AdminMeView.as_view()),
]
