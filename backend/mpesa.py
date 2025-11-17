import requests
from datetime import datetime
import base64
from django.conf import settings


def get_access_token():
    consumer_key = settings.MPESA_CONSUMER_KEY
    consumer_secret = settings.MPESA_CONSUMER_SECRET
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

    try:
        response = requests.get(url, auth=(consumer_key, consumer_secret))
        response.raise_for_status()
        data = response.json()

        if 'access_token' not in data:
            raise ValueError(f"Unexpected response: {data}")

        return data['access_token']

    except Exception as e:
        raise Exception(f"Failed to get access token: {str(e)}")


def initiate_stk_push(phone, amount, account_reference="NoseKnows", transaction_desc="Payment for order"):
    access_token = get_access_token()
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode(
        (settings.MPESA_SHORTCODE + settings.MPESA_PASSKEY + timestamp).encode('utf-8')
    ).decode('utf-8')

    headers = {"Authorization": f"Bearer {access_token}"}

    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
        "PartyB": settings.MPESA_SHORTCODE,
        "PhoneNumber": phone,
        "CallBackURL": settings.MPESA_CALLBACK_URL,
        "AccountReference": account_reference,
        "TransactionDesc": transaction_desc,
    }

    response = requests.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        json=payload,
        headers=headers
    )

    try:
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"STK push failed: {str(e)}", "details": response.text}
