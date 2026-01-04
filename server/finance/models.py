from django.db import models
from django.db.models import Sum
from users.models import User
from decimal import Decimal
from users.models import ClientProfile

class Invoice(models.Model):
   
    class InvoiceStatus(models.TextChoices):
        UNPAID = 'UNPAID', 'Unpaid'
        PAID = 'PAID', 'Paid'
        OVERDUE = 'OVERDUE', 'Overdue'

        
    
    client = models.ForeignKey(User, on_delete=models.PROTECT, limit_choices_to={'role': User.Role.CLIENT})
    status = models.CharField(max_length=20, choices=InvoiceStatus.choices, default=InvoiceStatus.UNPAID)
    issued_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    
    TVA_RATE = Decimal('0.19') #19% vat


    def save(self, *args, **kwargs):
       
        is_new = self._state.adding
        super().save(*args, **kwargs)
        if is_new:
            
            pass

    def delete(self, *args, **kwargs):
       
        client_profile = ClientProfile.objects.get(user=self.client)
        
        client_profile.balance -= self.montant_ttc
        client_profile.save()
        super().delete(*args, **kwargs)

    @property
    def montant_ht(self):
        aggregation = self.shipments.aggregate(total=Sum('total_cost'))
        return aggregation['total'] or Decimal('0.00')

    @property
    def montant_tva(self):
       #vat amount
        return self.montant_ht * self.TVA_RATE

    @property
    def montant_ttc(self):
        return self.montant_ht + self.montant_tva

    def __str__(self):
        return f"Invoice #{self.id} for {self.client.username} - {self.montant_ttc:.2f} TTC"

class Payment(models.Model):
    class PaymentMethod(models.TextChoices):
        CREDIT_CARD = 'CREDIT_CARD', 'Credit Card'
        BANK_TRANSFER = 'BANK_TRANSFER', 'Bank Transfer'
        CASH = 'CASH', 'Cash'
        
    invoice = models.ForeignKey(Invoice, on_delete=models.PROTECT, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=50, choices=PaymentMethod.choices)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        client_profile = ClientProfile.objects.get(user=self.invoice.client)
        client_profile.balance -= self.amount
        client_profile.save()

    def __str__(self):
        return f"Payment of {self.amount} for Invoice #{self.invoice.id}"
