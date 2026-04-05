from django.contrib import admin
from .models import Discount

@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ('title', 'code', 'discount_type', 'is_active', 'start_date')
    list_filter = ('discount_type', 'method', 'is_active')
    search_fields = ('title', 'code')
    
    # Grouping fields like Shopify's UI sections
    fieldsets = (
        ("General Info", {
            'fields': ('title', 'method', 'code', 'discount_type')
        }),
        ("Customer Requirements", {
            'fields': ('min_requirement_type', 'min_value', 'requirement_products')
        }),
        ("Discount Value", {
            'fields': ('value_type', 'value', 'reward_products')
        }),
        ("Active Dates & Limits", {
            'fields': ('usage_limit', 'once_per_customer', 'end_date', 'is_active')
        }),
    )
    filter_horizontal = ('requirement_products', 'reward_products')