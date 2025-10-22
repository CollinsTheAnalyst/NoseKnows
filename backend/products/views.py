from rest_framework import viewsets
from .models import Product
from .serializer import ProductSerializer
from rest_framework.permissions import IsAdminUser

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]  
