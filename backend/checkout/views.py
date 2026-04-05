import json
import uuid
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Order
from .mpesa import initiate_stk_push
from .analytics import get_analytics_data

# --- EMAIL HELPER ---
def send_order_confirmation_email(order, items_data=None):
    """
    Sends a luxury styled email to the customer upon successful payment.
    items_data: expects a list of dictionaries containing product details.
    """
    if not order.email:
        return
        
    subject = f"Order Confirmed! Your NoseKnows Luxury Scent is on the way (#{order.receipt_number or order.checkout_request_id})"
    from_email = settings.DEFAULT_FROM_EMAIL 
    
    to = order.email

    context = {
        'first_name': order.first_name or "Valued Customer",
        'order_id': order.receipt_number or order.checkout_request_id,
        'amount': order.amount,
        'status': order.status,
        'items': items_data,  # Passed to the template for the 'Your Selection' table
    }

    try:
        # Render HTML template from templates/emails/order_confirmation.html
        html_content = render_to_string('emails/order_confirmation.html', context)
        text_content = strip_tags(html_content) 

        msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
    except Exception as e:
        print(f"Email failed to send: {e}")


# --- ANALYTICS VIEW ---
@staff_member_required
def admin_analytics_view(request):
    context = get_analytics_data()
    context['title'] = 'Analytics'
    return render(request, 'admin/analytics.html', context)


# --- CARD PAYMENT VIEW ---
class CardPaymentView(APIView):
    def post(self, request):
        data = request.data
        items = data.get('items', []) # Capture items for email
        
        transaction_id = f"CARD-{uuid.uuid4().hex[:10].upper()}"
        
        order = Order.objects.create(
            checkout_request_id=transaction_id,
            amount=data.get('amount'),
            phone=data.get('phone', 'N/A'),
            email=data.get('email'),
            first_name=data.get('firstName'),
            status='COMPLETED'
        )

        order.receipt_number = f"BILL-{uuid.uuid4().hex[:6].upper()}"
        order.save()

        # Send Confirmation Email with items
        send_order_confirmation_email(order, items_data=items)

        return Response({
            "message": "Card Payment Successful",
            "transaction_id": transaction_id,
            "order_id": order.receipt_number,
            "status": "COMPLETED"
        }, status=status.HTTP_200_OK)


# --- CASH ON DELIVERY VIEW ---
class CODPaymentView(APIView):
    def post(self, request):
        data = request.data
        items = data.get('items', [])
        
        transaction_id = f"COD-{uuid.uuid4().hex[:10].upper()}"
        
        order = Order.objects.create(
            checkout_request_id=transaction_id,
            amount=data.get('amount'),
            phone=data.get('phone', 'N/A'),
            email=data.get('email'),
            first_name=data.get('firstName'),
            status='COMPLETED' # COD orders are marked completed to trigger confirmation
        )
        
        order.receipt_number = transaction_id
        order.save()

        send_order_confirmation_email(order, items_data=items)

        return Response({
            "message": "Order Placed Successfully",
            "order_id": order.receipt_number,
            "status": "COMPLETED"
        }, status=status.HTTP_200_OK)


# --- MPESA STK PUSH VIEW ---
class MpesaSTKPushView(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        amount = request.data.get('amount')
        email = request.data.get('email')
        first_name = request.data.get('firstName')
        items = request.data.get('items', []) # Capture items
        
        response = initiate_stk_push(phone, amount)
        
        if response.get('ResponseCode') == '0':
            Order.objects.create(
                checkout_request_id=response['CheckoutRequestID'],
                merchant_request_id=response['MerchantRequestID'],
                amount=amount,
                phone=phone,
                email=email,
                first_name=first_name,
                status='PENDING'
                # Note: items are usually stored in a separate OrderItem model. 
                # For email purposes, ensure your polling/callback can access this item list.
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
                    callback_metadata = stk_callback.get('CallbackMetadata', {}).get('Item', [])
                    receipt = None
                    for item in callback_metadata:
                        if item.get('Name') == 'MpesaReceiptNumber':
                            receipt = item.get('Value')
                    
                    order.status = 'COMPLETED'
                    order.receipt_number = receipt
                    order.save()

                    # Trigger Email
                    # For Mpesa callbacks, usually items are retrieved from the DB via a foreign key relationship
                    # If you don't have an OrderItem model, you may need to pass item data during STK push.
                    send_order_confirmation_email(order)
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
            "receipt": order.receipt_number,
            "customerName": order.first_name
        })
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)