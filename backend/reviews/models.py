from django.db import models
from django.conf import settings
from products.models import Product

class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()  # e.g., 1-5
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('product', 'user')  # One review per user per product
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.rating}⭐)"

# Optional: add a method in Product to get average rating
# products/models.py
from django.db.models import Avg

class Product(models.Model):
    # your existing fields...
    
    def average_rating(self):
        return self.reviews.aggregate(avg=Avg('rating'))['avg'] or 0
