from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .frontend_views import (
    FrontendProductViewSet,
    FrontendBrandViewSet,
    FrontendCategoryViewSet,
    FrontendProductTypeViewSet,
    FrontendFAQViewSet,  # ✅ new import
)

# Create a router for frontend API endpoints
router = DefaultRouter()
router.register(r'products', FrontendProductViewSet, basename='frontend-products')
router.register(r'brands', FrontendBrandViewSet, basename='frontend-brands')
router.register(r'categories', FrontendCategoryViewSet, basename='frontend-categories')
router.register(r'product-types', FrontendProductTypeViewSet, basename='frontend-product-types')
router.register(r'faqs', FrontendFAQViewSet, basename='frontend-faqs')  # ✅ new route

urlpatterns = [
    path('', include(router.urls)),
]
