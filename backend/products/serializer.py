from rest_framework import serializers
from .models import Brand, Category, ProductType, Product, ProductVariant, ProductImage, FAQ

# 🔹 Brand Serializer
class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'image']


# 🔹 Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


# 🔹 Product Type Serializer
class ProductTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductType
        fields = ['id', 'name']


# 🔹 Product Image Serializer
class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None


# 🔹 Product Variant Serializer
class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'price', 'quantity_available']


# 🔹 Product Serializer (Main)
class ProductSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    product_type = ProductTypeSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'scent_notes',
            'brand',
            'categories',
            'product_type',
            'images',
            'variants',
            'created_at',
            'updated_at',
        ]

# 🔹 FAQ Serializer
class FAQSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = FAQ
        fields = [
            'id',
            'question',
            'answer',
            'featured',
            'product',
            'product_name',
            'created_at',
        ]
