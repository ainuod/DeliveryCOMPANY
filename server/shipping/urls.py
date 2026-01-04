from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShipmentViewSet, TourViewSet, ParcelViewSet


router = DefaultRouter()
router.register(r'shipments', ShipmentViewSet, basename='shipment')
router.register(r'tours', TourViewSet, basename='tour')
router.register(r'parcels', ParcelViewSet, basename='parcel')

urlpatterns = [
    path('', include(router.urls)),
]

