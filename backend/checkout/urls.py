from django.urls import path
# ✅ Make sure check_payment_status is added to the import list
from .views import MpesaSTKPushView, mpesa_callback, check_payment_status

urlpatterns = [
    path('mpesa-pay/', MpesaSTKPushView.as_view(), name='mpesa_pay'),
    path('mpesa-callback/', mpesa_callback, name='mpesa_callback'),
    path('check-status/<str:checkout_id>/', check_payment_status, name='check_status'),
]