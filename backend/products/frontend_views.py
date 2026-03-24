from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework import generics
from .models import Product, Brand, Category, ProductType, FAQ
from .serializer import (
    ProductSerializer, BrandSerializer,
    CategorySerializer, ProductTypeSerializer, FAQSerializer
)

# 🔹 Frontend ViewSets
class FrontendProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    authentication_classes = [] 


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all().prefetch_related("images", "variants", "categories")
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    authentication_classes = [] 

class BrandListView(generics.ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

class FrontendBrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]
    authentication_classes = []  

class FrontendCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    authentication_classes = []  

class FrontendProductTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer
    permission_classes = [AllowAny]
    authentication_classes = []  


# Add this to frontend_views.py
class FAQListView(generics.ListAPIView):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]
    authentication_classes = []


# 🔹 FAQ ViewSet
class FrontendFAQViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]
    authentication_classes = []  

    def get_queryset(self):
        queryset = FAQ.objects.all().order_by('-created_at')

        product_id = self.request.query_params.get('product_id')
        if product_id:
            queryset = queryset.filter(product_id=product_id)

        featured = self.request.query_params.get('featured')
        if featured == 'true':
            queryset = queryset.filter(featured=True)

        return queryset
    

    