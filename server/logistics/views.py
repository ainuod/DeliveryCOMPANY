from rest_framework import viewsets
from users.models import User
from .models import Driver, Vehicle, Destination
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import BasePermission
from .serializers import DriverSerializer, VehicleSerializer, DestinationSerializer



class IsAdminOrAgent(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in [User.Role.ADMIN, User.Role.AGENT]
        )

class DriverViewSet(viewsets.ModelViewSet):
    
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    
    permission_classes = [IsAdminOrAgent]

class VehicleViewSet(viewsets.ModelViewSet):
    
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
     
    permission_classes = [IsAdminOrAgent]

class DestinationViewSet(viewsets.ModelViewSet):
   
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    
    permission_classes = [IsAuthenticated] 
