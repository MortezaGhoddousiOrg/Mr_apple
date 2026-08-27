import os
import uuid
import json
from django.conf import settings
from django.core.files.storage import default_storage
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, IsAdminUser

from authuser.authentication import AdminJWTAuthentication
from .models import Products, ProductImages, ProductVariant
from .serializers import ProductSerializer, ProductImageSerializer, ProductVariantSerializer



@api_view(["GET"])
def product_list(request):
    products = Products.objects.prefetch_related("variants").all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=200)


# -------------------------------
# PRODUCT BY CHILD CATEGORY
# -------------------------------
@api_view(["GET"])
def product_by_child(request, child_id):
    products = Products.objects.filter(category_id_id=child_id).prefetch_related("variants")
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=200)


# -------------------------------
# LATEST PRODUCTS
# -------------------------------
@api_view(["GET"])
def product_latest(request):
    products = Products.objects.order_by("-created_at")[:6]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=200)


# -------------------------------
# HOME PAGE PRODUCTS
# -------------------------------
@api_view(["GET"])
def product_home_list(request):
    products = Products.objects.order_by("-created_at")[:6]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=200)


# -------------------------------
# UPLOAD PRODUCT IMAGE
# -------------------------------
class UploadProductImage(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]

    def post(self, request):
        image = request.FILES.get("file")
        is_main = str(request.data.get("type", "false")).lower() == "true"

        if not image:
            return Response({"error": "No image provided"}, status=400)

        ext = image.name.split(".")[-1]
        unique_name = f"{uuid.uuid4()}.{ext}"

        save_path = os.path.join("images", "products", unique_name)
        stored_path = default_storage.save(save_path, image)

        img = ProductImages.objects.create(
            image=stored_path,
            is_main=is_main,
        )

        serializer = ProductImageSerializer(img)
        return Response(serializer.data, status=201)


# -------------------------------
# DELETE PRODUCT IMAGE
# -------------------------------
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


# -------------------------------
# CREATE PRODUCT
# -------------------------------
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


# -------------------------------
# UPDATE / DELETE PRODUCT
# -------------------------------
class ProductUpdateDeleteView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request, product_id):
        try:
            product = Products.objects.get(id=product_id)
        except Products.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        serializer = ProductSerializer(product)
        images_data = ProductImageSerializer(product.images.all(), many=True).data

        return Response({
            **serializer.data,
            "images": images_data,
        }, status=200)

    def put(self, request, product_id):
        try:
            product = Products.objects.get(id=product_id)
        except Products.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        image_ids = request.data.get("image_ids", [])
        deleted_image_ids = request.data.get("deleted_image_ids", [])
        new_main_image_id = request.data.get("main_image_id", None)

        # حذف عکس‌ها
        if deleted_image_ids:
            for img_id in deleted_image_ids:
                try:
                    img = ProductImages.objects.get(id=img_id, product_id=product)
                    if img.image and os.path.isfile(os.path.join(settings.MEDIA_ROOT, img.image.name)):
                        os.remove(os.path.join(settings.MEDIA_ROOT, img.image.name))
                    img.delete()
                except ProductImages.DoesNotExist:
                    pass

        # اضافه کردن عکس‌های جدید
        if image_ids:
            existing_image_ids = list(product.images.values_list("id", flat=True))
            new_image_ids = [int(id) for id in image_ids if int(id) not in existing_image_ids]
            if new_image_ids:
                ProductImages.objects.filter(id__in=new_image_ids).update(product_id=product)

        # عکس اصلی
        old_main_image = product.images.filter(is_main=True).first()

        if new_main_image_id:
            if old_main_image and old_main_image.id != new_main_image_id:
                old_main_image.is_main = False
                old_main_image.save()

            try:
                new_main = ProductImages.objects.get(id=new_main_image_id, product_id=product)
                new_main.is_main = True
                new_main.save()
            except ProductImages.DoesNotExist:
                pass

        data = {k: v for k, v in request.data.items() if k not in ["image_ids", "deleted_image_ids", "main_image_id"]}

        serializer = ProductSerializer(product, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        return Response({
            "message": "Product updated successfully",
            "product": ProductSerializer(product).data
        }, status=200)

    def delete(self, request, product_id):
        try:
            product = Products.objects.get(id=product_id)
        except Products.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        product.delete()

        return Response({"message": "Product deleted successfully"}, status=200)


# -------------------------------
# PRODUCT SEARCH
# -------------------------------
class ProductSearchView(APIView):
    def get(self, request):
        q = request.GET.get("q", "").strip()
        category_id = request.GET.get("category_id", None)

        products = Products.objects.all()

        if q:
            products = products.filter(
                Q(name__icontains=q) |
                Q(product_code__icontains=q) |
                Q(descriptions__icontains=q) |
                Q(more_description__icontains=q) |
                Q(category_id__title__icontains=q)
            )

        if category_id:
            try:
                category_id = int(category_id)
                products = products.filter(category_id_id=category_id)
            except ValueError:
                return Response({"error": "Invalid category_id"}, status=400)

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=200)


# -------------------------------
#  CREATE VARIANT
# -------------------------------
class VariantCreateView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]

    def post(self, request, product_id):
        try:
            product = Products.objects.get(id=product_id)
        except Products.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        serializer = ProductVariantSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        variant = serializer.save(product=product)

        return Response({
            "message": "Variant created",
            "variant": ProductVariantSerializer(variant).data
        }, status=201)


# -------------------------------
#  UPDATE / DELETE VARIANT
# -------------------------------
class VariantUpdateDeleteView(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]

    def put(self, request, variant_id):
        try:
            variant = ProductVariant.objects.get(id=variant_id)
        except ProductVariant.DoesNotExist:
            return Response({"error": "Variant not found"}, status=404)

        serializer = ProductVariantSerializer(variant, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        variant = serializer.save()

        return Response({
            "message": "Variant updated",
            "variant": ProductVariantSerializer(variant).data
        }, status=200)

    def delete(self, request, variant_id):
        try:
            variant = ProductVariant.objects.get(id=variant_id)
        except ProductVariant.DoesNotExist:
            return Response({"error": "Variant not found"}, status=404)

        variant.delete()

        return Response({"message": "Variant deleted"}, status=200)
