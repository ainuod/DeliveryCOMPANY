from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DriverViewSet, VehicleViewSet, DestinationViewSet


router = DefaultRouter()
router.register(r'drivers', DriverViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'destinations', DestinationViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
