from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser

from authuser.authentication import AdminJWTAuthentication
from .models import CategoryParent, CategoryChild
from .serializers import CategoryParentSerializer, CategoryChildSerializer
from catalog.models import Products
from catalog.serializers import ProductSerializer


# -------------------------------
# CATEGORY PARENT LIST (PUBLIC)
# -------------------------------
@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def category_parent_list(request):
    parents = CategoryParent.objects.all()
    serializer = CategoryParentSerializer(parents, many=True)
    return Response(serializer.data, status=200)


# -------------------------------
# CATEGORY CHILD LIST (PUBLIC)
# -------------------------------
@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def category_child_list(request):
    children = CategoryChild.objects.all()
    serializer = CategoryChildSerializer(children, many=True)
    return Response(serializer.data, status=200)


# -------------------------------
# CATEGORY DETAIL + RELATED + PRODUCTS (PUBLIC)
# -------------------------------
@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def category_detail_with_related(request, pk):
    try:
        category_child = CategoryChild.objects.get(id=pk)
    except CategoryChild.DoesNotExist:
        return Response({"error": "Category not found"}, status=404)

    parent = category_child.parent
    siblings = CategoryChild.objects.filter(parent=parent)

    products = Products.objects.filter(category_id=category_child)

    return Response({
        "category": CategoryChildSerializer(category_child).data,
        "parent": CategoryParentSerializer(parent).data,
        "related_categories": CategoryChildSerializer(siblings, many=True).data,
        "products": ProductSerializer(products, many=True).data,
    }, status=200)


# -------------------------------
# ADMIN CRUD (ONLY ADMIN)
# -------------------------------
class CategoryParentAdmin(APIView):
    authentication_classes = [AdminJWTAuthentication]
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = CategoryParentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    def put(self, request, pk):
        try:
            parent = CategoryParent.objects.get(id=pk)
        except CategoryParent.DoesNotExist:
            return Response({"error": "Parent category not found"}, status=404)

        serializer = CategoryParentSerializer(parent, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def delete(self, request, pk):
        try:
            parent = CategoryParent.objects.get(id=pk)
        except CategoryParent.DoesNotExist:
            return Response({"error": "Parent category not found"}, status=404)

        if parent.children.exists():
            return Response(
                {"error": "Cannot delete parent with existing child categories"},
                status=400
            )

        parent.delete()
        return Response({"message": "Parent category deleted"}, status=200)


class CategoryChildAdmin(APIView):
    """
    ⚠️ این ویو حالا هم GET عمومی (برای گرفتن یک دسته‌بندی فرعی با id) و هم
    PUT/DELETE مخصوص ادمین رو در یک مسیر واحد (child/<pk>/) مدیریت می‌کنه.
    قبلاً یک تابع جدا (category_child_detail) هم دقیقاً روی همین مسیر
    ثبت شده بود که چون فقط GET قبول می‌کرد و زودتر از این کلاس در urls.py
    چک می‌شد، هر PUT/DELETE ای رو با خطای 405 رد می‌کرد و اصلاً به این
    کلاس نمی‌رسید - همون چیزی که باعث می‌شد ویرایش/حذف دسته‌بندی فرعی در
    ادمین کار نکنه (برخلاف دسته‌بندی اصلی که همچین تصادمی نداشت).
    """
    authentication_classes = [AdminJWTAuthentication]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request, pk):
        try:
            child = CategoryChild.objects.get(id=pk)
        except CategoryChild.DoesNotExist:
            return Response({"error": "Child not found"}, status=404)

        serializer = CategoryChildSerializer(child)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = CategoryChildSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    def put(self, request, pk):
        try:
            child = CategoryChild.objects.get(id=pk)
        except CategoryChild.DoesNotExist:
            return Response({"error": "Child category not found"}, status=404)

        serializer = CategoryChildSerializer(child, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def delete(self, request, pk):
        try:
            child = CategoryChild.objects.get(id=pk)
        except CategoryChild.DoesNotExist:
            return Response({"error": "Child category not found"}, status=404)

        if child.products.exists():
            return Response(
                {"error": "Cannot delete child with existing products"},
                status=400
            )

        child.delete()
        return Response({"message": "Child category deleted"}, status=200)