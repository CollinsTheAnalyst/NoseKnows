# reviews/admin.py
from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    # Shows the most important info at a glance
    list_display = ('product', 'get_reviewer', 'rating', 'is_verified', 'is_visible', 'created_at')
    list_filter = ('rating', 'is_verified', 'is_visible', 'created_at')
    search_fields = ('guest_name', 'product__name', 'order_number', 'comment')
    list_editable = ('is_visible', 'is_verified') # Quick edits without opening the review

    def get_reviewer(self, obj):
        return obj.user.username if obj.user else obj.guest_name
    get_reviewer.short_description = 'Reviewer'