# backend/blog/admin.py
from django.contrib import admin
from .models import Category, Post

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'status', 'views', 'created_at')
    list_filter = ('status', 'created_at', 'category', 'author')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'created_at'
    raw_id_fields = ('author',) # Use a widget for selecting author if many users
    actions = ['make_published', 'make_draft']

    def make_published(self, request, queryset):
        queryset.update(status='published')
    make_published.short_description = "Mark selected posts as Published"

    def make_draft(self, request, queryset):
        queryset.update(status='draft')
    make_draft.short_description = "Mark selected posts as Draft"