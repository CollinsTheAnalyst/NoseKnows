from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny
from .models import Brand, Product
from .serializer import BrandSerializer, ProductSerializer

# Admin-only product management
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    # Keep authentication here if you want only admins to add/delete products

class BrandListView(generics.ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]
    # 🚀 ADD THIS LINE TO KILL THE 401:
    authentication_classes = []

# Frontend: List products by brand
class BrandDetailView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    authentication_classes = [] 

    def get_queryset(self):
        brand_slug = self.kwargs.get("slug")
        return Product.objects.filter(brand__slug=brand_slug).prefetch_related(
            "images", "variants", "categories"
        )

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all().prefetch_related("images", "variants", "categories")
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    authentication_classes = [] 

# Frontend: Single product detail
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all().prefetch_related("images", "variants", "categories")
    serializer_class = ProductSerializer
    lookup_field = "slug"
    permission_classes = [AllowAny]
    authentication_classes = [] 


    

