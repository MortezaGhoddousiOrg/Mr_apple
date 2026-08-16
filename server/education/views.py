import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

from authuser.authentication import AdminJWTAuthentication
from .models import News, Tutorial, EducationImages, NewsGallery
from .serializers import (
    EducationImageSerializer,
    NewsSerializer,
    TutorialSerializer,
    NewsGallerySerializer
)


# -----------------------------
# Upload Main Image
# -----------------------------
class UploadEducationImageView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No file provided"}, status=400)

        if not file.content_type.startswith("image/"):
            return Response({"error": "File must be an image"}, status=400)

        image = EducationImages.objects.create(image=file)
        serializer = EducationImageSerializer(image)

        return Response({
            "message": "Image saved",
            "data": serializer.data
        }, status=201)


# -----------------------------
# News List
# -----------------------------
class NewsListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        items = News.objects.prefetch_related("gallery").all()
        serializer = NewsSerializer(items, many=True)
        return Response(serializer.data, status=200)


# -----------------------------
# News Detail
# -----------------------------
class NewsDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, item_id):
        try:
            item = News.objects.prefetch_related("gallery").get(id=item_id)
        except News.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        serializer = NewsSerializer(item)
        return Response(serializer.data, status=200)


# -----------------------------
# Admin CRUD for News
# -----------------------------
class NewsAdminView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = NewsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = serializer.save()
        return Response({"message": "News created", "data": NewsSerializer(item).data}, status=201)

    def put(self, request, item_id):
        try:
            item = News.objects.get(id=item_id)
        except News.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        serializer = NewsSerializer(item, data=request.data)
        serializer.is_valid(raise_exception=True)
        item = serializer.save()
        return Response({"message": "News updated", "data": NewsSerializer(item).data}, status=200)

    def patch(self, request, item_id):
        try:
            item = News.objects.get(id=item_id)
        except News.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        serializer = NewsSerializer(item, data=request.data, partial=True)
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


# -----------------------------
# Upload Gallery Image for News
# -----------------------------
class NewsGalleryUploadView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, news_id):
        try:
            news = News.objects.get(id=news_id)
        except News.DoesNotExist:
            return Response({"error": "News not found"}, status=404)

        image = request.FILES.get("image")
        if not image:
            return Response({"error": "image file is required"}, status=400)

        gallery_item = NewsGallery.objects.create(news=news, image=image)
        serializer = NewsGallerySerializer(gallery_item)

        return Response({
            "message": "Gallery image uploaded",
            "data": serializer.data
        }, status=201)


# -----------------------------
# Tutorial List
# -----------------------------
class TutorialListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        items = Tutorial.objects.all()
        serializer = TutorialSerializer(items, many=True)
        return Response(serializer.data, status=200)


# -----------------------------
# Tutorial Detail
# -----------------------------
class TutorialDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, item_id):
        try:
            item = Tutorial.objects.get(id=item_id)
        except Tutorial.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        serializer = TutorialSerializer(item)
        return Response(serializer.data, status=200)


# -----------------------------
# Admin CRUD for Tutorial
# -----------------------------
class TutorialAdminView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = TutorialSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = serializer.save()
        return Response({"message": "Tutorial created", "data": TutorialSerializer(item).data}, status=201)

    def put(self, request, item_id):
        try:
            item = Tutorial.objects.get(id=item_id)
        except Tutorial.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        serializer = TutorialSerializer(item, data=request.data)
        serializer.is_valid(raise_exception=True)
        item = serializer.save()
        return Response({"message": "Tutorial updated", "data": TutorialSerializer(item).data}, status=200)

    def patch(self, request, item_id):
        try:
            item = Tutorial.objects.get(id=item_id)
        except Tutorial.DoesNotExist:
            return Response({"error": "Item not found"}, status=404)

        serializer = TutorialSerializer(item, data=request.data, partial=True)
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
