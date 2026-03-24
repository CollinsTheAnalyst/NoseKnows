from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, 
    ProductListView, 
    ProductDetailView, 
    BrandListView, 
    BrandDetailView
)

router = DefaultRouter()
# Keep this for admin actions (POST, PUT, DELETE)
router.register(r'admin-products', ProductViewSet, basename='admin-product')

urlpatterns = [
    # 1. Include the router for admin functions
    path('', include(router.urls)),

    # 2. Public Product Routes (These use AllowAny/IsAuthenticatedOrReadOnly)
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),

    # 3. Public Brand Routes
    path('brands/', BrandListView.as_view(), name='brand-list'),
    path('brands/<slug:slug>/', BrandDetailView.as_view(), name='brand-detail'),
]