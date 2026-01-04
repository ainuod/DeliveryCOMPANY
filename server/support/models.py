from django.db import models
from shipping.models import Shipment
from users.models import User

class Incident(models.Model):
   
    class IncidentType(models.TextChoices):
        PARCEL_DAMAGED = 'PARCEL_DAMAGED', 'Parcel Damaged'
        DELIVERY_DELAYED = 'DELIVERY_DELAYED', 'Delivery Delayed'
        ADDRESS_ERROR = 'ADDRESS_ERROR', 'Address Error'
        OTHER = 'OTHER', 'Other'

    class IncidentStatus(models.TextChoices):
        OPEN = 'OPEN', 'Open'
        IN_RESOLUTION = 'IN_RESOLUTION', 'In Resolution'
        RESOLVED = 'RESOLVED', 'Resolved'
        
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='incidents')
    incident_type = models.CharField(max_length=50, choices=IncidentType.choices)
    description = models.TextField()
    status = models.CharField(max_length=50, choices=IncidentStatus.choices, default=IncidentStatus.OPEN)
    
    date_occurred = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True)
    
   
    photo = models.ImageField(upload_to='incident_photos/', null=True, blank=True)
    
    reported_by = models.ForeignKey(User, on_delete=models.PROTECT, help_text="Agent or driver who reported the incident.")

    def __str__(self):
        return f"{self.get_incident_type_display()} on Shipment #{self.shipment.id}"

class Claim(models.Model):
   
    class ClaimStatus(models.TextChoices):
        RECEIVED = 'RECEIVED', 'Received'
        UNDER_ANALYSIS = 'UNDER_ANALYSIS', 'Under Analysis'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        REFUSED = 'REFUSED', 'Refused'
        
    client = models.ForeignKey(User, on_delete=models.PROTECT, limit_choices_to={'role': User.Role.CLIENT}, related_name='claims')
    
   
    incident = models.ForeignKey(Incident, on_delete=models.SET_NULL, null=True, blank=True, related_name='claims')
    
    reason = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=50, choices=ClaimStatus.choices, default=ClaimStatus.RECEIVED)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Claim #{self.id} from {self.client.username}"
