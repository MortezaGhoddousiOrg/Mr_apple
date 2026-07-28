from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from .models import Users

class UserView(APIView):

    def get(self, request):
        users = Users.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        print("=== User Create ===")
        print("request.data:", request.data)
        
        data = request.data.copy()
        
        # ✅ حذف فیلدهای اضافی که در مدل نیستند
        data.pop('password', None)
        data.pop('is_active', None)
        data.pop('is_staff', None)
        data.pop('created_at', None)
        data.pop('updated_at', None)
        data.pop('id', None)
        
        # ✅ تنظیم پیش‌فرض‌ها
        if 'role' not in data or not data['role']:
            data['role'] = 'customer'
        if 'status' not in data or not data['status']:
            data['status'] = 'active'
        
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User created", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        print("❌ Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(APIView):

    def get(self, request, id):
        try:
            user = Users.objects.get(id=id)
        except Users.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, id):
        try:
            user = Users.objects.get(id=id)
        except Users.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        data = request.data.copy()
        
        # ✅ حذف فیلدهای اضافی که در مدل نیستند
        data.pop('password', None)
        data.pop('is_active', None)
        data.pop('is_staff', None)
        data.pop('created_at', None)
        data.pop('updated_at', None)
        data.pop('id', None)
        
        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User updated", "data": serializer.data})
        print("❌ Validation errors:", serializer.errors)
        return Response(serializer.errors, status=400)

    def delete(self, request, id):
        try:
            user = Users.objects.get(id=id)
        except Users.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        user.delete()
        return Response({"message": "User deleted"})