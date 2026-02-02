from rest_framework import serializers
from shipping.models import Shipment
from users.models import User
from .models import Incident, Claim
from users.serializers import UserSerializer
from shipping.serializers import ShipmentSerializer 

class IncidentSerializer(serializers.ModelSerializer):
    
    
    shipment = ShipmentSerializer(read_only=True)
    reported_by = UserSerializer(read_only=True)
    
    # PrimaryKeyRelatedField to accept just the ID.
    shipment_id = serializers.PrimaryKeyRelatedField(
        queryset=Shipment.objects.all(), source='shipment', write_only=True
    )
    reported_by_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='reported_by', write_only=True, required=False
    )
    
    
    
    class Meta:
        model = Incident
        fields = [
            'id', 'shipment', 'incident_type', 'description', 'status', 
            'date_occurred', 'location', 'photo', 'reported_by',
            'shipment_id', 'reported_by_id'
        ]
        read_only_fields = ['date_occurred', 'reported_by']

class ClaimSerializer(serializers.ModelSerializer):
   
    client = UserSerializer(read_only=True)
    incident = IncidentSerializer(read_only=True, required=False)

   
    incident_id = serializers.PrimaryKeyRelatedField(
        queryset=Incident.objects.all(), source='incident', write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Claim
        fields = [
            'id', 'client', 'incident', 'reason', 'description', 'status', 
            'created_at', 'incident_id'
        ]
