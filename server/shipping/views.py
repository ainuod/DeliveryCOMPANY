from rest_framework import viewsets
from users.models import User
from .models import Shipment, Tour, Parcel
from .serializers import ShipmentSerializer, TourSerializer, ParcelSerializer
from rest_framework.exceptions import PermissionDenied
from users.permissions import IsOwnerOrAdmin
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import BasePermission


class IsAdminOrAgent(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in [User.Role.ADMIN, User.Role.AGENT])

class ShipmentViewSet(viewsets.ModelViewSet):
   
    
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
       
        user = self.request.user
        if user.role in [User.Role.ADMIN, User.Role.AGENT]:
            return Shipment.objects.select_related('client', 'origin', 'destination').prefetch_related('parcels').all()
        elif user.role == User.Role.CLIENT:
            return Shipment.objects.filter(client=user).select_related('origin', 'destination').prefetch_related('parcels')
        return Shipment.objects.none() # Block access for others
    serializer_class = ShipmentSerializer

    def perform_update(self, serializer):
        #  prevent editing if in a tour
        shipment = self.get_object()
        if shipment.tour is not None:
            raise PermissionDenied("Cannot modify a shipment that is already in a delivery tour")
        super().perform_update(serializer)

    def perform_destroy(self, instance):
        # prevent deleting if in a tour
        if instance.tour is not None:
            raise PermissionDenied("Cannot delete a shipment that is already in a delivery tour")
        super().perform_destroy(instance)

class TourViewSet(viewsets.ModelViewSet):
   
    queryset = Tour.objects.select_related('driver__user', 'vehicle').all()
    serializer_class = TourSerializer
   
    permission_classes = [IsAdminOrAgent]

class ParcelViewSet(viewsets.ModelViewSet):
   
    queryset = Parcel.objects.all()
    serializer_class = ParcelSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
