from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import User

class IsAdminUser(BasePermission):
    
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == User.Role.ADMIN)


class IsOwnerOrAdmin(BasePermission):
   
    def has_object_permission(self, request, view, obj):
        # an admin can access any object
        if request.user.is_authenticated and request.user.role == User.Role.ADMIN:
            return True
            
        # check if the client or user attribute matches the ones requested by the user
        if hasattr(obj, 'client'):
            return obj.client == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
            
        return False
