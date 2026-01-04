from rest_framework import serializers
from .models import Driver, Vehicle, Destination
from users.serializers import UserSerializer 

class VehicleSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Vehicle
        fields = '__all__' 

class DestinationSerializer(serializers.ModelSerializer):
  
    class Meta:
        model = Destination
        fields = '__all__'

class DriverSerializer(serializers.ModelSerializer):
    
    
    user = UserSerializer(read_only=True)

    class Meta:
        model = Driver
        fields = ['id', 'user', 'license_number', 'is_available']
