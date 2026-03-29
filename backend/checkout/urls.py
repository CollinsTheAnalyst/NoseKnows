from django.urls import path
# ✅ Added CardPaymentView to the imports
from .views import (
    MpesaSTKPushView, 
    CardPaymentView, 
    mpesa_callback, 
    check_payment_status
)

urlpatterns = [
    # --- M-Pesa Routes ---
    path('mpesa-pay/', MpesaSTKPushView.as_view(), name='mpesa_pay'),
    path('mpesa-callback/', mpesa_callback, name='mpesa_callback'),
    
    # --- Card Routes ---
    path('card-pay/', CardPaymentView.as_view(), name='card_pay'),
    
    # --- Status/Polling Route ---
    # This works for both Card and M-Pesa since they both store a checkout_id/transaction_id
    path('check-status/<str:checkout_id>/', check_payment_status, name='check_status'),
]