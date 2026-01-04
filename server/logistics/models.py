from django.db import models
from users.models import User 

class Driver(models.Model):
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'role': User.Role.DRIVER})
    license_number = models.CharField(max_length=100, unique=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.user.get_full_name() or self.user.username

class Vehicle(models.Model):
  
    class VehicleType(models.TextChoices):
        TRUCK = 'TRUCK', 'Truck'
        VAN = 'VAN', 'Van'
        CAR = 'CAR', 'Car'
    
    registration_number = models.CharField(max_length=50, unique=True)
    vehicle_type = models.CharField(max_length=20, choices=VehicleType.choices)
    capacity_kg = models.PositiveIntegerField(help_text="capacity in kilograms")
    fuel_consumption = models.DecimalField(max_digits=5, decimal_places=2, help_text="liters per 100km")
    is_in_service = models.BooleanField(default=True)

    def __str__(self):
        return self.registration_number

class Destination(models.Model):
    
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    geographic_zone = models.CharField(max_length=100, blank=True)
    
    base_rate = models.DecimalField(max_digits=10, decimal_places=2) # Tarif de base
    weight_rate_per_kg = models.DecimalField(max_digits=10, decimal_places=2, help_text="Cost per KG")
    volume_rate_per_m3 = models.DecimalField(max_digits=10, decimal_places=2, help_text="Cost per cubic meter")

    def __str__(self):
        return f"{self.city}, {self.country}"
