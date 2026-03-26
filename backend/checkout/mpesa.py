import requests
from datetime import datetime
import base64
from django.conf import settings

def get_access_token():
    consumer_key = settings.MPESA_CONSUMER_KEY
    consumer_secret = settings.MPESA_CONSUMER_SECRET
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

    try:
        # Using basic auth to get the Bearer token
        response = requests.get(url, auth=(consumer_key, consumer_secret))
        response.raise_for_status()
        return response.json()['access_token']
    except Exception as e:
        raise Exception(f"Failed to get access token: {str(e)}")

def initiate_stk_push(phone, amount, account_reference="NoseKnows", transaction_desc="Payment for order"):
    # ✅ FIX 1: Clean Phone Number (Convert 07xx to 2547xx)
    if phone.startswith("0"):
        phone = "254" + phone[1:]
    elif phone.startswith("+"):
        phone = phone[1:]

    access_token = get_access_token()
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    
    # Password = Base64(Shortcode + Passkey + Timestamp)
    password_str = settings.MPESA_SHORTCODE + settings.MPESA_PASSKEY + timestamp
    password = base64.b64encode(password_str.encode('utf-8')).decode('utf-8')

    headers = {"Authorization": f"Bearer {access_token}"}

    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(float(amount)), # ✅ FIX 2: Ensure it's an integer
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

    return response.json()