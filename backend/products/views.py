from rest_framework import generics, viewsets
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import Brand, Product
from .serializer import BrandSerializer, ProductSerializer

# ✅ Admin-only product management (keep this if needed)
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]  # only admins can manage products

# ✅ Frontend: List all brands
class BrandListView(generics.ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]  # everyone can see

# ✅ Frontend: List products by brand
class BrandDetailView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        brand_slug = self.kwargs.get("slug")
        return Product.objects.filter(brand__slug=brand_slug).prefetch_related(
            "images", "variants", "categories"
        )

# ✅ Frontend: List all products
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all().prefetch_related("images", "variants", "categories")
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

# ✅ Frontend: Single product detail
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all().prefetch_related("images", "variants", "categories")
    serializer_class = ProductSerializer
    lookup_field = "slug"
    permission_classes = [AllowAny]
