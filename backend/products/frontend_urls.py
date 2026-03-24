from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .frontend_views import (
    ProductListView,  # Ensure this is imported
    BrandListView,    # Ensure this is imported
    FAQListView,      # Ensure this is imported
    FrontendProductViewSet,
    FrontendBrandViewSet,
    FrontendCategoryViewSet,
    FrontendProductTypeViewSet,
    FrontendFAQViewSet,
)

router = DefaultRouter()
router.register(r'products', FrontendProductViewSet, basename='frontend-products')
router.register(r'brands', FrontendBrandViewSet, basename='frontend-brands')
router.register(r'categories', FrontendCategoryViewSet, basename='frontend-categories')
router.register(r'product-types', FrontendProductTypeViewSet, basename='frontend-product-types')
router.register(r'faqs', FrontendFAQViewSet, basename='frontend-faqs')

urlpatterns = [
    # 🚀 MOVE THESE TO THE TOP
    # These match /api/products/, /api/brands/, etc. and use the UNLOCKED views
    path('products/', ProductListView.as_view(), name='product-list'),
    path('brands/', BrandListView.as_view(), name='brand-list'),
    path('faqs/', FAQListView.as_view(), name='faq-list'),

    # The router stays at the bottom as a fallback
    path('', include(router.urls)),
]