from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny
from .models import Brand, Product
from .serializers import BrandSerializer, ProductSerializer
from rest_framework import generics, permissions
from .models import FAQ
from .serializers import FAQSerializer

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


class FAQList(generics.ListAPIView):
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = [] # Fix for the 401/403 issues

    def get_queryset(self):
        queryset = FAQ.objects.all()
        featured_param = self.request.query_params.get('featured')
        
        if featured_param == 'true':
            # Use 'featured' because that's what is in your Serializer/Model
            queryset = queryset.filter(featured=True) 
            
        return queryset.order_by('-created_at')
    

