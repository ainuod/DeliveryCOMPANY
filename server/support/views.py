from rest_framework import viewsets
from users.models import User
from .models import Incident, Claim
from .serializers import IncidentSerializer, ClaimSerializer
from users.permissions import IsOwnerOrAdmin
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import BasePermission


class IsAdminOrAgent(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in [User.Role.ADMIN, User.Role.AGENT])

class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.select_related('shipment', 'reported_by').all()
    serializer_class = IncidentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in [User.Role.ADMIN, User.Role.AGENT]:
            return Incident.objects.select_related('shipment', 'reported_by').all()
        elif user.role == User.Role.CLIENT:
            # Clients can only see incidents related to their shipments
            return Incident.objects.filter(shipment__client=user).select_related('shipment', 'reported_by')
        elif user.role == User.Role.DRIVER:
             # Drivers see incidents they reported ?? or all? Let's say reported by them
             return Incident.objects.filter(reported_by=user).select_related('shipment', 'reported_by')
        return Incident.objects.none()

class ClaimViewSet(viewsets.ModelViewSet):
    
    serializer_class = ClaimSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin] # The owner is the claim.client

    def get_queryset(self):
       
        user = self.request.user
        if user.role in [User.Role.ADMIN, User.Role.AGENT]:
            return Claim.objects.all()
        elif user.role == User.Role.CLIENT:
            return Claim.objects.filter(client=user)
        return Claim.objects.none()

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)
   