from django.urls import path
from .views import MeView, SendCodeView, VerifyCodeView, AdminLoginView

urlpatterns = [
    path("send-code/", SendCodeView.as_view()),
    path("verify-code/", VerifyCodeView.as_view()),
    path("admin/login/", AdminLoginView.as_view()),
    path("me/", MeView.as_view()),
]
