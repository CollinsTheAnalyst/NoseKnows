from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Payment
from .serializer import PaymentSerializer
from mpesa import initiate_stk_push


# --- Handles CRUD for Payment model ---
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]


# --- Handles real-time M-Pesa payment initiation (STK Push) ---
class MpesaPaymentView(APIView):
    permission_classes = [AllowAny]  # change to IsAuthenticated later if needed

    def post(self, request):
        phone = request.data.get("phone")
        amount = request.data.get("amount")
        account_reference = request.data.get("account_reference", "NoseKnows Order")
        description = request.data.get("description", "Payment for NoseKnows order")

        if not phone or not amount:
            return Response(
                {"error": "Phone number and amount are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            response = initiate_stk_push(
                phone=phone,
                amount=amount,
                account_reference=account_reference,
                transaction_desc=description,
            )
            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
