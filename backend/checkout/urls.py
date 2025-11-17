from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, MpesaPaymentView

router = DefaultRouter()
router.register(r'payments', PaymentViewSet, basename='payments')

urlpatterns = [
    path('', include(router.urls)),
    path('mpesa-pay/', MpesaPaymentView.as_view(), name='mpesa-pay'),
]
