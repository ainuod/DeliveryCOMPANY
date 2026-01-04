from rest_framework import viewsets
from users.models import User
from .models import Invoice, Payment
from .serializers import InvoiceSerializer, PaymentSerializer
from users.permissions import IsAdminUser, IsOwnerOrAdmin
from rest_framework.permissions import BasePermission
from rest_framework.permissions import IsAuthenticated


class IsAdminOrAgent(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in [User.Role.ADMIN, User.Role.AGENT]
        )

class InvoiceViewSet(viewsets.ModelViewSet):
     
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin] 

    def get_queryset(self):
        user = self.request.user
        if user.role in [User.Role.ADMIN, User.Role.AGENT]:
            return Invoice.objects.all()
        elif user.role == User.Role.CLIENT:
            return Invoice.objects.filter(client=user)
        return Invoice.objects.none()


    

class PaymentViewSet(viewsets.ModelViewSet):
    
    
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        user = self.request.user
        if user.role in [user.Role.ADMIN, user.Role.AGENT]:
            return Payment.objects.all()
        elif user.role == user.Role.CLIENT:
            
            return Payment.objects.filter(invoice__client=user)
        
        return Payment.objects.none()

    def get_permissions(self):
       
        
        if self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        
        elif self.action == 'create':
            self.permission_classes = [IsAdminOrAgent]
        
        return super().get_permissions()
