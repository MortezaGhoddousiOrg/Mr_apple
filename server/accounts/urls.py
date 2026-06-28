from django.urls import path
from .views import UserView, UserDetailView

urlpatterns = [
    path('user/', UserView.as_view()),   
    path('user/<int:id>/', UserDetailView.as_view()),
]