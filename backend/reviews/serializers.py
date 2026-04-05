# backend/reviews/serializers.py
from rest_framework import serializers
from .models import Review

# ✅ NO self-imports here!
class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True) 
    
    class Meta:
        model = Review
        fields = [
            'id', 
            'product', 
            'user', 
            'guest_name', 
            'order_number', 
            'rating', 
            'comment', # This ensures the description/comment is picked up
            'is_verified', 
            'created_at'
        ]