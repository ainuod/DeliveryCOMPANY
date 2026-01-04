from rest_framework import serializers
from logistics.models import Destination
from .models import Shipment, Parcel, Tour
from users.models import User
from users.serializers import UserSerializer 
from logistics.serializers import DriverSerializer, VehicleSerializer, DestinationSerializer

class ParcelSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Parcel
        
        fields = ['id', 'tracking_number', 'weight_kg', 'height_cm', 'width_cm', 'length_cm']

class ShipmentSerializer(serializers.ModelSerializer):
   
   
    client = UserSerializer(read_only=True)
    origin = DestinationSerializer(read_only=True)
    destination = DestinationSerializer(read_only=True)
    
   
    parcels = ParcelSerializer(many=True)

    
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=User.Role.CLIENT), source='client', write_only=True
    )
    origin_id = serializers.PrimaryKeyRelatedField(
        queryset=Destination.objects.all(), source='origin', write_only=True
    )
    destination_id = serializers.PrimaryKeyRelatedField(
        queryset=Destination.objects.all(), source='destination', write_only=True
    )

    class Meta:
        model = Shipment
        fields = [
            'id', 'client', 'origin', 'destination', 'tour', 'status', 'total_cost',
            'created_at', 'parcels', 'client_id', 'origin_id', 'destination_id', 'service_type'
        ]
        
        read_only_fields = ['tour', 'total_cost', 'status']

    def create(self, validated_data):
        
        parcels_data = validated_data.pop('parcels')
        shipment = Shipment.objects.create(**validated_data)
        
       
        for parcel_data in parcels_data:
            Parcel.objects.create(shipment=shipment, **parcel_data)
            
        
        
        return shipment

class TourSerializer(serializers.ModelSerializer):
   
    driver = DriverSerializer(read_only=True)
    vehicle = VehicleSerializer(read_only=True)
    
   
    shipments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Tour
        fields = [
            'id', 'driver', 'vehicle', 'status', 'departure_time',
            'estimated_completion_time', 'shipments'
        ]
