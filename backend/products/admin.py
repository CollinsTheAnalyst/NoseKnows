from django.contrib import admin
from .models import Brand, Category, ProductType, Tag, Product, ProductVariant, ProductImage, FAQ
from django.utils.html import format_html 

# --- Inlines ---

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'is_feature', 'alt_text')

class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = ('size', 'price', 'compare_at_price', 'quantity_available', 'sku')

# --- Model Admins ---

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Table View
    list_display = ("product_info", "brand", "price_range", "stock_status", "view_on_site")
    list_filter = ("brand", "is_active", "in_stock")
    search_fields = ("name", "brand__name")
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ('categories', 'tags')
    inlines = [ProductImageInline, ProductVariantInline]

    # Add/Edit Page Layout (TailAdmin 2-Column style)
    fieldsets = (
        ('Product Information', {
            'fields': ('name', 'description', 'brand', 'product_type', 'categories', 'tags'),
            'classes': ('form-main',), 
        }),
        ('Inventory & Status', {
            'fields': ('is_active', 'is_featured', 'in_stock'),
            'classes': ('form-sidebar',), 
        }),
        ('Scent Notes', {
            'fields': ('top_notes', 'heart_notes', 'base_notes'),
            'classes': ('form-main',), 
        }),
        ('Search Engine Optimization', {
            'classes': ('collapse', 'form-main'),
            'fields': ('slug', 'meta_title', 'meta_description'),
        }),
    )

    # Methods (Correctly Indented inside the Class)
    def product_info(self, obj):
        img = obj.images.filter(is_feature=True).first() or obj.images.first()
        img_url = img.image.url if img else "/static/admin/img/no-image.png"
        return format_html(
            '<div style="display: flex; align-items: center; gap: 12px;">'
            '<img src="{}" style="width: 45px; height: 45px; border-radius: 8px; object-fit: cover; border: 1px solid #eee;" />'
            '<div>'
            '<div style="font-weight: 600; color: #1c2434; font-size: 14px;">{}</div>'
            '<div style="font-size: 11px; color: #64748b;">{}</div>'
            '</div></div>',
            img_url, obj.name, obj.brand.name if obj.brand else "Perfume"
        )
    product_info.short_description = "Product"

    def stock_status(self, obj):
        if obj.in_stock:
            return format_html('<span class="badge-success">In Stock</span>')
        return format_html('<span class="badge-danger">Out of Stock</span>')
    stock_status.short_description = "Stock"

    def price_range(self, obj):
        variants = obj.variants.all()
        if variants.exists():
            prices = [v.price for v in variants]
            return f"Ksh {min(prices):,.0f}" if min(prices) == max(prices) else f"Ksh {min(prices):,.0f} - {max(prices):,.0f}"
        return "N/A"
    price_range.short_description = "Price"

    def view_on_site(self, obj):
        url = f"http://localhost:5173/product/{obj.slug}"
        return format_html(
            '<a href="{}" target="_blank" class="view-page-btn">View Page ↗</a>', 
            url
        )
    view_on_site.short_description = "Storefront"


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    # Table View for Brands (Visual like Product list)
    list_display = ("brand_info", "slug")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}

    # Add/Edit Layout
    fieldsets = (
        ('Brand Details', {
            'fields': ('name', 'description', 'image'),
            'classes': ('form-main',),
        }),
        ('SEO', {
            'fields': ('slug',),
            'classes': ('form-sidebar',),
        }),
    )

    def brand_info(self, obj):
        img_url = obj.image.url if obj.image else "/static/admin/img/no-image.png"
        return format_html(
            '<div style="display: flex; align-items: center; gap: 12px;">'
            '<img src="{}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid #eee;" />'
            '<span style="font-weight: 600; color: #1c2434;">{}</span>'
            '</div>',
            img_url, obj.name
        )
    brand_info.short_description = "Brand"


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