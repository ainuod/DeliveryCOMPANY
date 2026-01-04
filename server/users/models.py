from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
   
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        AGENT = 'AGENT', 'Agent'
        DRIVER = 'DRIVER', 'Driver'
        CLIENT = 'CLIENT', 'Client'

    
    role = models.CharField(max_length=50, choices=Role.choices)
    
class ClientProfile(models.Model):
   
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField()
    phone_number = models.CharField(max_length=20)

    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # solde éventuel

    def __str__(self):
        return self.user.username
