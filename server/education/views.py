from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser

from authuser.authentication import AdminJWTAuthentication
from .models import EducationImages, News, Tutorial
from .serializers import EducationImageSerializer, NewsSerializer, TutorialSerializer


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


class UploadEducationImage(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]

    def post(self, request):
        image_url = request.data.get("image")

        if not image_url:
            return Response({"error": "image field is required"}, status=400)

        img = EducationImages.objects.create(image=image_url)

        return Response({
            "message": "Image saved",
            "data": EducationImageSerializer(img).data
        }, status=201)
