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
        read_only_fields = ['tracking_number']

import uuid

class ShipmentSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    # Use DictField for input to bypass DestinationSerializer's strict validation
    origin = serializers.DictField(write_only=True)
    destination = serializers.DictField(write_only=True)
    
    # Use nested serializers for output representation
    origin_detail = DestinationSerializer(source='origin', read_only=True)
    destination_detail = DestinationSerializer(source='destination', read_only=True)
    
    parcels = ParcelSerializer(many=True)

    client_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=User.Role.CLIENT), source='client', write_only=True
    )

    class Meta:
        model = Shipment
        fields = [
            'id', 'client', 'origin', 'destination', 'origin_detail', 'destination_detail', 'tour', 'status', 'total_cost',
            'created_at', 'parcels', 'client_id', 'service_type'
        ]
        read_only_fields = ['tour', 'total_cost']

    def create(self, validated_data):
        parcels_data = validated_data.pop('parcels')
        origin_data = validated_data.pop('origin')
        destination_data = validated_data.pop('destination')

        # Get or Create Origin with default rates if needed
        origin, _ = Destination.objects.get_or_create(
            city=origin_data['city'],
            country=origin_data['country'],
            defaults={
                'base_rate': 10.00,
                'weight_rate_per_kg': 2.00,
                'volume_rate_per_m3': 50.00
            }
        )

        # Get or Create Destination with default rates if needed
        destination, _ = Destination.objects.get_or_create(
            city=destination_data['city'],
            country=destination_data['country'],
            defaults={
                'base_rate': 10.00,
                'weight_rate_per_kg': 2.00,
                'volume_rate_per_m3': 50.00
            }
        )

        shipment = Shipment.objects.create(
            origin=origin,
            destination=destination,
            **validated_data
        )
        
        for parcel_data in parcels_data:
            # Auto-generate tracking number if missing
            if 'tracking_number' not in parcel_data or not parcel_data['tracking_number']:
                parcel_data['tracking_number'] = f"TRK-{uuid.uuid4().hex[:8].upper()}"
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
