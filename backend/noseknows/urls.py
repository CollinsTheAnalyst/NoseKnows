# backend/noseknows/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import RedirectView
from checkout.views import admin_analytics_view 


urlpatterns = [
    path('', RedirectView.as_view(url='/admin/', permanent=True)),
    path('admin/', admin.site.urls),

    path('api/users/', include('users.urls')),
    path('api/checkout/', include('checkout.urls')),
    
    # This acts as a fallback for brands, faqs, and products
    path('api/', include('products.urls')), 

    path('admin/analytics/', admin_analytics_view, name='admin-analytics'),
    
    # Keep these for specific structure
    path('api/carts/', include('carts.urls')),
    path('api/wishlist/', include('wishlist.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/reviews/', include('reviews.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


