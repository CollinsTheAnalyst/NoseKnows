from rest_framework import viewsets
from rest_framework.permissions import AllowAny
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

class FrontendBrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]

class FrontendCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class FrontendProductTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer
    permission_classes = [AllowAny]


# 🔹 NEW: FAQ ViewSet (for both homepage + product-specific)
class FrontendFAQViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = FAQ.objects.all().order_by('-created_at')

        # If product_id provided → show only FAQs for that product
        product_id = self.request.query_params.get('product_id')
        if product_id:
            queryset = queryset.filter(product_id=product_id)

        # If ?featured=true → show only homepage FAQs
        featured = self.request.query_params.get('featured')
        if featured == 'true':
            queryset = queryset.filter(featured=True)

        return queryset
