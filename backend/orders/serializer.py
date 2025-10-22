from rest_framework import serializers
from .models import Order, OrderItem
from products.serializer import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Order
        fields = ['id', 'user', 'user_email', 'status', 'total_amount', 'created_at', 'updated_at', 'items']
