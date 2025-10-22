from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Wishlist, WishlistItem
from .serializer import WishlistSerializer, WishlistItemSerializer

class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

class WishlistItemViewSet(viewsets.ModelViewSet):
    queryset = WishlistItem.objects.all()
    serializer_class = WishlistItemSerializer
    permission_classes = [IsAuthenticated]
