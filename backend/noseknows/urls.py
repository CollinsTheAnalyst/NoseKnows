# backend/noseknows/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import RedirectView # ✅ ADD RedirectView

urlpatterns = [
    # 👇 ADD THIS LINE TO REDIRECT ROOT (/) TO /admin/
    path('', RedirectView.as_view(url='/admin/', permanent=True)), 

    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/products/', include('products.urls')),
    path('api/carts/', include('carts.urls')),
    path('api/wishlist/', include('wishlist.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/checkout/', include('checkout.urls')),
    path('api/', include('reviews.urls')),
    path('frontend/', include('products.frontend_urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)