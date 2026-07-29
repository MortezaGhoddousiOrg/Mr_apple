import os
from datetime import datetime
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

from authuser.authentication import AdminJWTAuthentication
from .models import News, Tutorial, EducationImages
from .serializers import (
    EducationImageSerializer,
    NewsSerializer,
    TutorialSerializer
)


# ==================== آپلود تصویر ====================

class UploadEducationImageView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            print("=== Upload Image Request ===")
            print(f"User: {request.user}")
            print(f"Files: {request.FILES}")
            
            # چک کردن وجود فایل
            file = request.FILES.get("file")
            if not file:
                return Response(
                    {"error": "No file provided"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # چک کردن نوع فایل
            if not file.content_type.startswith('image/'):
                return Response(
                    {"error": "File must be an image"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            print(f"File name: {file.name}")
            print(f"File size: {file.size}")
            print(f"Content type: {file.content_type}")

            # ایجاد تصویر
            image = EducationImages.objects.create(image=file)
            serializer = EducationImageSerializer(image)
            
            print(f"Image saved: {image.id}")
            
            return Response({
                "message": "Image saved",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"=== Upload Error ===")
            print(f"Error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ------------------ PUBLIC NEWS ------------------

class NewsListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        items = News.objects.all()
        serializer = NewsSerializer(items, many=True)
        return Response(serializer.data, status=200)


class NewsDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, item_id):
        try:
            item = News.objects.get(id=item_id)
        except News.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        serializer = NewsSerializer(item)
        return Response(serializer.data, status=200)


# ------------------ ADMIN NEWS ------------------

class NewsAdminView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]

    def post(self, request):
        print("=== NewsAdminView.post ===")
        print(f"request.data: {request.data}")
        
        # تبدیل QueryDict به dict معمولی
        data = {}
        for key, value in request.data.items():
            data[key] = value
        
        print(f"data after conversion: {data}")
        
        if 'image_id' in data:
            print(f"✅ image_id found: {data['image_id']}")
        else:
            print("⚠️ image_id NOT found")
        
        serializer = NewsSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        item = serializer.save()
        return Response({"message": "News created", "data": NewsSerializer(item).data}, status=201)

    def put(self, request, item_id):
        try:
            item = News.objects.get(id=item_id)
        except News.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        print("=== NewsAdminView.put ===")
        print(f"request.data: {request.data}")
        
        data = {}
        for key, value in request.data.items():
            data[key] = value
        
        print(f"data after conversion: {data}")
        
        if 'image_id' in data:
            print(f"✅ image_id found: {data['image_id']}")
        else:
            print("⚠️ image_id NOT found")
        
        serializer = NewsSerializer(item, data=data)
        serializer.is_valid(raise_exception=True)
        item = serializer.save()
        return Response({"message": "News updated", "data": NewsSerializer(item).data}, status=200)

    def patch(self, request, item_id):
        try:
            item = News.objects.get(id=item_id)
        except News.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        print("=== NewsAdminView.patch ===")
        print(f"request.data: {request.data}")
        
        data = {}
        for key, value in request.data.items():
            data[key] = value
        
        print(f"data after conversion: {data}")
        
        if 'image_id' in data:
            print(f"✅ image_id found: {data['image_id']}")
        else:
            print("⚠️ image_id NOT found")
        
        serializer = NewsSerializer(item, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        item = serializer.save()
        return Response({"message": "News partially updated", "data": NewsSerializer(item).data}, status=200)

    def delete(self, request, item_id):
        try:
            item = News.objects.get(id=item_id)
        except News.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        item.delete()
        return Response({"message": "News deleted"}, status=200)


# ------------------ PUBLIC TUTORIALS ------------------

class TutorialListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        items = Tutorial.objects.all()
        serializer = TutorialSerializer(items, many=True)
        return Response(serializer.data, status=200)


class TutorialDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, item_id):
        try:
            item = Tutorial.objects.get(id=item_id)
        except Tutorial.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        serializer = TutorialSerializer(item)
        return Response(serializer.data, status=200)


# ------------------ ADMIN TUTORIALS ------------------

class TutorialAdminView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]

    def post(self, request):
        print("=== TutorialAdminView.post ===")
        print(f"request.data: {request.data}")
        
        data = {}
        for key, value in request.data.items():
            data[key] = value
        
        print(f"data after conversion: {data}")
        
        if 'image_id' in data:
            print(f"✅ image_id found: {data['image_id']}")
        else:
            print("⚠️ image_id NOT found")
        
        serializer = TutorialSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        item = serializer.save()
        return Response({"message": "Tutorial created", "data": TutorialSerializer(item).data}, status=201)

    def put(self, request, item_id):
        try:
            item = Tutorial.objects.get(id=item_id)
        except Tutorial.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        print("=== TutorialAdminView.put ===")
        print(f"request.data: {request.data}")
        
        data = {}
        for key, value in request.data.items():
            data[key] = value
        
        print(f"data after conversion: {data}")
        
        if 'image_id' in data:
            print(f"✅ image_id found: {data['image_id']}")
        else:
            print("⚠️ image_id NOT found")
        
        serializer = TutorialSerializer(item, data=data)
        serializer.is_valid(raise_exception=True)
        item = serializer.save()
        return Response({"message": "Tutorial updated", "data": TutorialSerializer(item).data}, status=200)

    def patch(self, request, item_id):
        try:
            item = Tutorial.objects.get(id=item_id)
        except Tutorial.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        print("=== TutorialAdminView.patch ===")
        print(f"request.data: {request.data}")
        
        data = {}
        for key, value in request.data.items():
            data[key] = value
        
        print(f"data after conversion: {data}")
        
        if 'image_id' in data:
            print(f"✅ image_id found: {data['image_id']}")
        else:
            print("⚠️ image_id NOT found")
        
        serializer = TutorialSerializer(item, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        item = serializer.save()
        return Response({"message": "Tutorial partially updated", "data": TutorialSerializer(item).data}, status=200)

    def delete(self, request, item_id):
        try:
            item = Tutorial.objects.get(id=item_id)
        except Tutorial.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        item.delete()
        return Response({"message": "Tutorial deleted"}, status=200)