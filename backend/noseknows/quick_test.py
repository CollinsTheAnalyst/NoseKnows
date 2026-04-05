import smtplib
from email.message import EmailMessage

# --- CONFIGURATION ---
# Use the exact details you put in your .env
EMAIL_ADDRESS = "collinskimathimwiti@gmail.com" 
APP_PASSWORD = "mcnkjapcsgjzwnmq"
DESTINATION = "collinskimathimwiti@gmail.com" # Send to yourself to test

msg = EmailMessage()
msg['Subject'] = "NoseKnows SMTP Test"
msg['From'] = EMAIL_ADDRESS
msg['To'] = DESTINATION
msg.set_content("If you're reading this, your Gmail SMTP connection is working perfectly!")

try:
    print("Connecting to Gmail server...")
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(EMAIL_ADDRESS, APP_PASSWORD)
        print("Login successful! Sending email...")
        smtp.send_message(msg)
    print("✅ Email sent successfully!")
except Exception as e:
    print(f"❌ Error: {e}")