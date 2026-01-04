from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('logistics.urls')),
    path('api/', include('shipping.urls')),
    path('api/', include('finance.urls')),
    path('api/', include('support.urls')),
    path('api/', include('analytics.urls')),

     
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
