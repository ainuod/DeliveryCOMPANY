from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IncidentViewSet, ClaimViewSet


router = DefaultRouter()
router.register(r'incidents', IncidentViewSet, basename='incident')
router.register(r'claims', ClaimViewSet, basename='claim')


urlpatterns = [
    path('', include(router.urls)),
]
