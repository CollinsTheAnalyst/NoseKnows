from django.contrib import admin
from .models import Brand, Category, ProductType, Product, ProductVariant, ProductImage, FAQ


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "brand", "product_type", "created_at")
    list_filter = ("brand", "product_type", "categories")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline, ProductVariantInline]


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    list_display = ("name",)


# ✅ New FAQ admin registration
@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "product", "featured", "created_at")
    list_filter = ("featured", "product")
    search_fields = ("question", "answer", "product__name")
