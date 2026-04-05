from django.db import models
from products.models import Product

class Discount(models.Model):
    # --- DISCOUNT TYPES (Match Shopify Modal) ---
    TYPE_CHOICES = [
        ('PRODUCT_AMOUNT', 'Amount off products'),
        ('BUY_X_GET_Y', 'Buy X get Y'),
        ('ORDER_AMOUNT', 'Amount off order'),
        ('FREE_SHIPPING', 'Free shipping'),
    ]

    # --- BASIC INFO ---
    title = models.CharField(max_length=255, help_text="e.g. Summer Sale 2026")
    method = models.CharField(max_length=20, choices=[('CODE', 'Code'), ('AUTO', 'Automatic')], default='CODE')
    code = models.CharField(max_length=50, unique=True, null=True, blank=True)
    discount_type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    # --- CUSTOMER BUYS (Requirements) ---
    min_requirement_type = models.CharField(max_length=20, choices=[('QTY', 'Minimum quantity'), ('AMOUNT', 'Minimum purchase')], default='QTY')
    min_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Selection of products the customer MUST buy
    requirement_products = models.ManyToManyField(Product, related_name="required_in_discounts", blank=True)

    # --- CUSTOMER GETS (The Reward) ---
    value_type = models.CharField(max_length=20, choices=[('PERCENT', 'Percentage'), ('FIXED', 'Fixed Amount'), ('FREE', 'Free')], default='PERCENT')
    value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # For Buy X Get Y: The specific products they get a discount on
    reward_products = models.ManyToManyField(Product, related_name="rewarded_in_discounts", blank=True)

    # --- USAGE LIMITS ---
    usage_limit = models.PositiveIntegerField(null=True, blank=True)
    once_per_customer = models.BooleanField(default=False)
    
    # --- ACTIVE DATES ---
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} ({self.code if self.code else 'Automatic'})"