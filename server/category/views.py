from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import CategoryParent, CategoryChild
from .serializers import CategoryParentSerializer, CategoryChildSerializer
from catalog.models import Products
from catalog.serializers import ProductSerializer


#   CATEGORY PARENT CRUD

class CategoryParentList(APIView):
    def get(self, request):
        parents = CategoryParent.objects.all()
        serializer = CategoryParentSerializer(parents, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = CategoryParentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class CategoryParentDetail(APIView):
    def get(self, request, pk):
        try:
            parent = CategoryParent.objects.get(id=pk)
        except CategoryParent.DoesNotExist:
            return Response({"error": "Parent not found"}, status=404)

        serializer = CategoryParentSerializer(parent)
        return Response(serializer.data, status=200)

    def put(self, request, pk):
        try:
            parent = CategoryParent.objects.get(id=pk)
        except CategoryParent.DoesNotExist:
            return Response({"error": "Parent not found"}, status=404)

        serializer = CategoryParentSerializer(parent, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            parent = CategoryParent.objects.get(id=pk)
        except CategoryParent.DoesNotExist:
            return Response({"error": "Parent not found"}, status=404)

        parent.delete()
        return Response({"message": "Parent deleted"}, status=200)


#   CATEGORY CHILD CRUD

class CategoryChildList(APIView):
    def get(self, request):
        children = CategoryChild.objects.all()
        serializer = CategoryChildSerializer(children, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = CategoryChildSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class CategoryChildDetail(APIView):
    def get(self, request, pk):
        try:
            child = CategoryChild.objects.get(id=pk)
        except CategoryChild.DoesNotExist:
            return Response({"error": "Child not found"}, status=404)

        serializer = CategoryChildSerializer(child)
        return Response(serializer.data, status=200)

    def put(self, request, pk):
        try:
            child = CategoryChild.objects.get(id=pk)
        except CategoryChild.DoesNotExist:
            return Response({"error": "Child not found"}, status=404)

        serializer = CategoryChildSerializer(child, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            child = CategoryChild.objects.get(id=pk)
        except CategoryChild.DoesNotExist:
            return Response({"error": "Child not found"}, status=404)

        child.delete()
        return Response({"message": "Child deleted"}, status=200)


#   CATEGORY DETAIL + RELATED + PRODUCTS

@api_view(["GET"])
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