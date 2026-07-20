import uuid
import os
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny

from authuser.authentication import AdminJWTAuthentication
from .models import Products, ProductImages
from .serializers import ProductSerializer, ProductImageSerializer
from rest_framework.permissions import IsAdminUser
from django.db.models import Q



#   PRODUCT LIST 
@api_view(["GET"])
def product_list(request):
    products = Products.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=200)


#   PRODUCT BY CHILD ID 
@api_view(["GET"])
def product_by_child(request, child_id):
    products = Products.objects.filter(category_id_id=child_id)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=200)


#   LATEST 6 PRODUCTS 
@api_view(["GET"])
def product_latest(request):
    products = Products.objects.order_by("-created_at")[:6]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=200)


#   HOME PAGE — ONLY 6 PRODUCTS
@api_view(["GET"])
def product_home_list(request):
    products = Products.objects.order_by("-created_at")[:6]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=200)


#   PRODUCT IMAGE UPLOAD
class UploadProductImage(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]

    def post(self, request):

        image = request.FILES.get('file')
        is_main = str(request.data.get("type", "false")).lower() == "true"

        if not image:
            return Response({"error": "No image provided"}, status=400)

        ext = image.name.split('.')[-1]
        unique_name = f"{uuid.uuid4()}.{ext}"

        save_path = os.path.join("images", 'products', unique_name)
        stored_path = default_storage.save(save_path, image)

        img = ProductImages.objects.create(
            image=stored_path,
            is_main=is_main,
        )

        serializer = ProductImageSerializer(img)
        return Response(serializer.data, status=201)


#   DELETE PRODUCT IMAGE
class DeleteProductImage(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]

    def delete(self, request, image_id):
        try:
            img = ProductImages.objects.get(id=image_id)
        except ProductImages.DoesNotExist:
            return Response({"error": "Image not found"}, status=404)

        file_path = os.path.join(settings.MEDIA_ROOT, img.image.name)

        img.delete()

        if os.path.isfile(file_path):
            os.remove(file_path)

        return Response({"message": "Image deleted"}, status=200)


#   CREATE PRODUCT 
class ProductCreateView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = serializer.save()

        image_ids = request.data.get("image_ids", [])
        if image_ids:
            ProductImages.objects.filter(id__in=image_ids).update(product_id=product)

        return Response({
            "message": "Product created successfully",
            "product": ProductSerializer(product).data
        }, status=201)


#   UPDATE & DELETE PRODUCT
class ProductUpdateDeleteView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]
    
    def get(self, request, product_id):
        try:
            product = Products.objects.get(id=product_id)
        except Products.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=404
            )

        serializer = ProductSerializer(product)
        data = serializer.data

        all_images = product.images.all()
        images_data = ProductImageSerializer(all_images, many=True).data

        return Response({
            "id": data["id"],
            "product_code": data["product_code"],
            "name": data["name"],
            "sell_price": data["sell_price"],
            "buy_price": data["buy_price"],
            "quantity": data["quantity"],
            "discount": data["discount"],
            "descriptions": data["descriptions"],
            "category_id": data["category_child_id"],
            "status": data["status"],
            "feature": data["feature"],
            "images": images_data,  
        }, status=200)

    def put(self, request, product_id):
        try:
            product = Products.objects.get(id=product_id)
        except Products.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=404
            )

        serializer = ProductSerializer(
            product,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "message": "Product updated successfully",
            "product": serializer.data
        }, status=200)

    def delete(self, request, product_id):
        try:
            product = Products.objects.get(id=product_id)
        except Products.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=404
            )

        product.delete()

        return Response({
            "message": "Product deleted successfully"
        }, status=200)
        
        
class ProductSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        q = request.GET.get("q", "").strip()

        if not q:
            return Response({"error": "q parameter is required"}, status=400)

        products = Products.objects.filter(
            Q(name__icontains=q) |
            Q(product_code__icontains=q) |
            Q(descriptions__icontains=q) |
            Q(more_description__icontains=q)
        )

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=200)