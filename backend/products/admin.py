from django.contrib import admin
from .models import Brand, Category, ProductType, Tag, Product, ProductVariant, ProductImage, FAQ
from django.utils.html import format_html 

# --- Inlines ---

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'is_feature', 'alt_text') # Added 'is_feature'

class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    # Added compare_at_price and SKU for better inventory management
    fields = ('size', 'price', 'compare_at_price', 'quantity_available', 'sku')

# --- Model Admins --

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # We use fields that are guaranteed to be in your model now
    list_display = ("name", "brand", "is_active", "view_on_site")
    list_filter = ("brand", "is_active", "in_stock")
    search_fields = ("name", "brand__name")
    prepopulated_fields = {"slug": ("name",)}
    
    # Only use horizontal filter if the ManyToMany fields are definitely migrated
    filter_horizontal = ('categories', 'tags')
    
    inlines = [ProductImageInline, ProductVariantInline]

    def view_on_site(self, obj):
        url = f"http://localhost:5173/product/{obj.slug}"
        return format_html('<a href="{}" target="_blank" style="font-weight:bold; color:#e91e63;">View Page ↗</a>', url)
    
    view_on_site.short_description = "Storefront"

    fieldsets = (
        ('Core Details', {
            'fields': ('brand', 'name', 'description', 'product_type', 'categories', 'tags', 'top_notes', 'heart_notes', 'base_notes')
        }),
        ('Visibility', {
            'fields': ('is_active', 'is_featured', 'in_stock'),
        }),
        ('SEO', {
            'classes': ('collapse',),
            'fields': ('slug', 'meta_title', 'meta_description'),
        }),
    )

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)

@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    list_display = ("name",)

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "product", "featured", "created_at")
    list_filter = ("featured", "product")
    search_fields = ("question", "answer", "product__name")