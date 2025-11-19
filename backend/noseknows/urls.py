# backend/noseknows/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import RedirectView

urlpatterns = [
    # Redirect the root URL (/) to the Admin login page
    path('', RedirectView.as_view(url='/admin/', permanent=True)),

    path('admin/', admin.site.urls),

    # Consolidate API app routing under /api/
    path('api/', include('users.urls')),
    path('api/', include('products.urls')),
    path('api/', include('carts.urls')),
    path('api/', include('wishlist.urls')),
    path('api/', include('orders.urls')),
    path('api/', include('checkout.urls')),
    path('api/', include('reviews.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)