from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from products.models import Product

class Review(models.Model):
    # Link to the product being reviewed
    product = models.ForeignKey(
        Product, 
        related_name='product_reviews', 
        on_delete=models.CASCADE
    )
    
    # Optional link to a registered user
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    
    # ✅ Captures the name entered during the Checkout phase
    guest_name = models.CharField(
        max_length=100, 
        blank=True, 
        null=True, 
        help_text="Name captured from the checkout form"
    )
    
    # ✅ Explicit link to the order for dashboard tracking
    order_number = models.CharField(
        max_length=50, 
        blank=True, 
        null=True, 
        help_text="The #NK order ID associated with this purchase"
    )
    
    # Star rating with strict 1-5 validation
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=5
    )
    
    comment = models.TextField(
        blank=True, 
        null=True, 
        help_text="Customer feedback wording"
    )

    # ✅ Trust signal: Automatically set to True when submitted via CheckoutConfirmation
    is_verified = models.BooleanField(
        default=False, 
        help_text="Check if the reviewer actually purchased the item"
    )
    
    # Internal moderation toggle
    is_visible = models.BooleanField(
        default=True, 
        help_text="Toggle to hide inappropriate reviews from the frontend"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Product Review"
        verbose_name_plural = "Product Reviews"

    def __str__(self):
        reviewer = self.user.username if self.user else self.guest_name or "Guest"
        status = " (Verified)" if self.is_verified else ""
        return f"{reviewer}{status} - {self.product.name} ({self.rating}⭐)"