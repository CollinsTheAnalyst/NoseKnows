import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.admin.views.decorators import staff_member_required # ✅ New Import
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Order
from .mpesa import initiate_stk_push
from .analytics import get_analytics_data

# --- ANALYTICS VIEW ---
@staff_member_required # ✅ Ensures only logged-in admins see this
def admin_analytics_view(request):
    context = get_analytics_data()
    context['title'] = 'Analytics'
    return render(request, 'admin/analytics.html', context)

# --- MPESA STK PUSH VIEW ---
class MpesaSTKPushView(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        amount = request.data.get('amount')
        
        response = initiate_stk_push(phone, amount)
        
        if response.get('ResponseCode') == '0':
            Order.objects.create(
                checkout_request_id=response['CheckoutRequestID'],
                merchant_request_id=response['MerchantRequestID'],
                amount=amount,
                phone=phone
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
                    receipt = next((i['Value'] for i in items if i['Name'] == 'MpesaReceiptNumber'), None)
                    
                    order.status = 'COMPLETED'
                    order.receipt_number = receipt
                    order.save()
                    print(f"✅ Order {checkout_id} SUCCESS")
                else:
                    order.status = 'FAILED'
                    order.save()
                    print(f"❌ Order {checkout_id} FAILED")

            except Order.DoesNotExist:
                print(f"⚠️ Unknown Order ID: {checkout_id}")

            return JsonResponse({"ResultCode": 0, "ResultDesc": "Success"})

        except Exception as e:
            print(f"🔥 Callback Error: {str(e)}")
            return JsonResponse({"ResultCode": 1, "ResultDesc": "Error"}, status=400)

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