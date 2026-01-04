from rest_framework import viewsets, permissions
from .models import User
from .serializers import UserSerializer
from rest_framework import permissions
from .permissions import IsAdminUser

class UserViewSet(viewsets.ModelViewSet):
    
    queryset = User.objects.all().order_by('-date_joined')
    
    
    serializer_class = UserSerializer
    

    # Only Admins can list , create, , delete users
    permission_classes = [IsAdminUser]

    
