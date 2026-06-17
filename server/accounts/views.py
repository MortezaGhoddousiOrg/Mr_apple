from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from authuser.models import User

class UserView(APIView):

    def get(self, request):
        User = User.objects.all()
        serializer = UserSerializer(User, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
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
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User updated", "data": serializer.data})
        return Response(serializer.errors, status=400)

    def delete(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        user.delete()
        return Response({"message": "User deleted"})