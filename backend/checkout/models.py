from django.db import models
from django.conf import settings
from orders.models import Order

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('card', 'Card'),
        ('mobile', 'Mobile Money'),
        ('paypal', 'PayPal'),
    ]

    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    completed = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
