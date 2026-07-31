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
        data = request.data.copy()
        data.pop('password', None)
        data.pop('is_active', None)
        data.pop('is_staff', None)

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
        data.pop('password', None)
        data.pop('is_active', None)
        data.pop('is_staff', None)

        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User updated", "data": serializer.data})
        return Response(serializer.errors, status=400)

    def delete(self, request, id):
        try:
            user = Users.objects.get(id=id)
        except Users.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        user.delete()
        return Response({"message": "User deleted"})