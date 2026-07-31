import uuid
import os
import json
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
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
            "more_description": data["more_description"],  
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

        print(f"=== Product Update ===")
        print(f"request.data: {request.data}")

        image_ids = request.data.get("image_ids", [])
        deleted_image_ids = request.data.get("deleted_image_ids", [])
        new_main_image_id = request.data.get("main_image_id", None)
        
        if isinstance(image_ids, str):
            try:
                image_ids = json.loads(image_ids)
            except:
                image_ids = [int(x.strip()) for x in image_ids.split(',') if x.strip()]
        
        if isinstance(deleted_image_ids, str):
            try:
                deleted_image_ids = json.loads(deleted_image_ids)
            except:
                deleted_image_ids = [int(x.strip()) for x in deleted_image_ids.split(',') if x.strip()]
        
        print(f"image_ids: {image_ids}")
        print(f"deleted_image_ids: {deleted_image_ids}")
        print(f"new_main_image_id: {new_main_image_id}")

        if deleted_image_ids:
            for img_id in deleted_image_ids:
                try:
                    img = ProductImages.objects.get(id=img_id, product_id=product)
                    if img.image and os.path.isfile(os.path.join(settings.MEDIA_ROOT, img.image.name)):
                        os.remove(os.path.join(settings.MEDIA_ROOT, img.image.name))
                    img.delete()
                except ProductImages.DoesNotExist:
                    print(f"⚠️ Image {img_id} not found for this product")

        if image_ids:
            existing_image_ids = list(product.images.values_list('id', flat=True))
            new_image_ids = [int(id) for id in image_ids if int(id) not in existing_image_ids]
            
            if new_image_ids:
                ProductImages.objects.filter(id__in=new_image_ids).update(product_id=product)
                print(f"✅ Added new images: {new_image_ids}")

        old_main_image = product.images.filter(is_main=True).first()
        
        if new_main_image_id:
            if old_main_image and old_main_image.id != new_main_image_id:
                if old_main_image.image and os.path.isfile(os.path.join(settings.MEDIA_ROOT, old_main_image.image.name)):
                    os.remove(os.path.join(settings.MEDIA_ROOT, old_main_image.image.name))
                old_main_image.delete()
                print(f"✅ Deleted old main image: {old_main_image.id}")
            
            try:
                new_main = ProductImages.objects.get(id=new_main_image_id, product_id=product)
                new_main.is_main = True
                new_main.save()
                print(f"✅ Set new main image: {new_main_image_id}")
            except ProductImages.DoesNotExist:
                print(f"⚠️ Main image {new_main_image_id} not found for this product")
        else:
            if not old_main_image:
                first_image = product.images.first()
                if first_image:
                    first_image.is_main = True
                    first_image.save()
                    print(f"✅ Set first image as main: {first_image.id}")

        data = {}
        for key, value in request.data.items():
            if key not in ['image_ids', 'deleted_image_ids', 'main_image_id']:
                data[key] = value

        if 'more_descriptions' in data:
            data['more_description'] = data.pop('more_descriptions')

        serializer = ProductSerializer(
            product,
            data=data,
            partial=True
        )

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
            return Response(
                {"error": "Product not found"},
                status=404
            )

        product.delete()

        return Response({
            "message": "Product deleted successfully"
        }, status=200)
        
        
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

        if not q and not category_id:
            products = Products.objects.all()

        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=200)