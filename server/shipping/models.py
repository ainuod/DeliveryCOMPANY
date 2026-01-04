from django.db import models
from users.models import User
from logistics.models import Destination, Driver, Vehicle
from django.db.models import Sum, F, ExpressionWrapper

class Shipment(models.Model):
    class ServiceType(models.TextChoices): # 1
        STANDARD = 'STANDARD', 'Standard'
        EXPRESS = 'EXPRESS', 'Express'
        
    

    class ShipmentStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        IN_TRANSIT = 'IN_TRANSIT', 'In Transit'
        DELIVERED = 'DELIVERED', 'Delivered'
        CANCELLED = 'CANCELLED', 'Cancelled'

    client = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        limit_choices_to={'role': User.Role.CLIENT}
    )
    origin = models.ForeignKey(
        Destination,
        related_name='shipments_from',
        on_delete=models.PROTECT
    )
    destination = models.ForeignKey(
        Destination,
        related_name='shipments_to',
        on_delete=models.PROTECT
    )
    tour = models.ForeignKey(
        'Tour',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='shipments'
    )

    # shipment can be linked to one invoice, an invoice can have MANY shipments
    # on_delete=models.SET_NULL: If an invoice is deleted the shipment stays
    

    invoice = models.ForeignKey('finance.Invoice', on_delete=models.SET_NULL, null=True, blank=True, related_name='shipments')

    service_type = models.CharField(max_length=20, choices=ServiceType.choices, default=ServiceType.STANDARD) # 1

    status = models.CharField(
        max_length=20,
        choices=ShipmentStatus.choices,
        default=ShipmentStatus.PENDING
    )
    total_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_cost(self):
       
        if not self.pk:
            return 0.00

        total_weight = self.parcels.aggregate(
            total=Sum('weight_kg')
        )['total'] or 0

        total_volume = self.parcels.aggregate(
            total=Sum(
                ExpressionWrapper(
                    F('length_cm') * F('width_cm') * F('height_cm') / 1000000.0,
                    output_field=models.DecimalField()
                )
            )
        )['total'] or 0

        destination_rates = self.destination
        cost = (
            destination_rates.base_rate +
            (total_weight * destination_rates.weight_rate_per_kg) +
            (total_volume * destination_rates.volume_rate_per_m3)
        )
        return cost

    def save(self, *args, **kwargs):
        
        # automatically calculate cost.
        
        super().save(*args, **kwargs)

        new_cost = self.calculate_cost()
        if self.total_cost != new_cost:
            self.total_cost = new_cost
            super().save(update_fields=['total_cost'])

    def __str__(self):
        return f"Shipment #{self.id} from {self.origin.city} to {self.destination.city}"


class Parcel(models.Model):
   
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='parcels')
    tracking_number = models.CharField(max_length=100, unique=True)
    weight_kg = models.DecimalField(max_digits=7, decimal_places=2)
    # i think in cm 
    height_cm = models.PositiveIntegerField()
    width_cm = models.PositiveIntegerField()
    length_cm = models.PositiveIntegerField()

    def __str__(self):
        return self.tracking_number

class Tour(models.Model):
    #tournée
    
    class TourStatus(models.TextChoices):
        PLANNED = 'PLANNED', 'Planned'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'

    driver = models.ForeignKey(Driver, on_delete=models.PROTECT)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT)
    
    status = models.CharField(max_length=20, choices=TourStatus.choices, default=TourStatus.PLANNED)
    
    departure_time = models.DateTimeField()
    estimated_completion_time = models.DateTimeField()
    mileage_km = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    duration_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    fuel_consumed_liters = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"Tour #{self.id} by {self.driver.user.username} on {self.departure_time.date()}"
