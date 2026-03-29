import json
import uuid
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Order
from .mpesa import initiate_stk_push
from .analytics import get_analytics_data

# --- ANALYTICS VIEW ---
@staff_member_required
def admin_analytics_view(request):
    context = get_analytics_data()
    context['title'] = 'Analytics'
    return render(request, 'admin/analytics.html', context)


# --- CARD PAYMENT VIEW (NEW) ---
class CardPaymentView(APIView):
    """
    Handles Credit Card logic. 
    In a real app, you'd integrate Stripe or Flutterwave here.
    """
    def post(self, request):
        data = request.data
        amount = data.get('amount')
        email = data.get('email')
        
        # 1. Create a pending Order in the DB
        # We generate a unique transaction ID since Card doesn't use 'CheckoutRequestID'
        transaction_id = f"CARD-{uuid.uuid4().hex[:10].upper()}"
        
        order = Order.objects.create(
            checkout_request_id=transaction_id,
            amount=amount,
            phone=data.get('phone', 'N/A'),
            status='PENDING',
            # You might want to add name/email fields to your Order model
        )

        # 2. MOCK GATEWAY LOGIC
        # Usually, you'd send card details to your provider here.
        # If successful:
        order.status = 'COMPLETED'
        order.receipt_number = f"BILL-{uuid.uuid4().hex[:6].upper()}"
        order.save()

        return Response({
            "message": "Card Payment Successful",
            "transaction_id": transaction_id,
            "status": "COMPLETED"
        }, status=status.HTTP_200_OK)


# --- MPESA STK PUSH VIEW ---
class MpesaSTKPushView(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        amount = request.data.get('amount')
        
        # Ensure we capture extra details from your new Checkout form
        email = request.data.get('email')
        first_name = request.data.get('firstName')
        
        response = initiate_stk_push(phone, amount)
        
        if response.get('ResponseCode') == '0':
            Order.objects.create(
                checkout_request_id=response['CheckoutRequestID'],
                merchant_request_id=response['MerchantRequestID'],
                amount=amount,
                phone=phone,
                # Store extra info if your model supports it
                status='PENDING'
            )
            return Response({
                "message": "STK Push Sent", 
                "checkout_id": response['CheckoutRequestID']
            })
        
        return Response({"error": "Failed to send STK Push"}, status=400)

# --- MPESA CALLBACK VIEW ---
@csrf_exempt
def mpesa_callback(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            stk_callback = data.get('Body', {}).get('stkCallback', {})
            result_code = stk_callback.get('ResultCode')
            checkout_id = stk_callback.get('CheckoutRequestID')

            try:
                order = Order.objects.get(checkout_request_id=checkout_id)
                if result_code == 0:
                    items = stk_callback.get('CallbackMetadata', {}).get('Item', [])
                    # Safer way to get receipt
                    receipt = None
                    for item in items:
                        if item.get('Name') == 'MpesaReceiptNumber':
                            receipt = item.get('Value')
                    
                    order.status = 'COMPLETED'
                    order.receipt_number = receipt
                    order.save()
                else:
                    order.status = 'FAILED'
                    order.save()

            except Order.DoesNotExist:
                pass

            return JsonResponse({"ResultCode": 0, "ResultDesc": "Success"})
        except Exception as e:
            return JsonResponse({"ResultCode": 1, "ResultDesc": str(e)}, status=400)

    return JsonResponse({"error": "Method not allowed"}, status=405)

# --- STATUS POLLING VIEW ---
@api_view(['GET'])
def check_payment_status(request, checkout_id):
    try:
        order = Order.objects.get(checkout_request_id=checkout_id)
        return Response({
            "status": order.status,
            "receipt": order.receipt_number
        })
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)