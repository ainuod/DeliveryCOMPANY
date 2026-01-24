from rest_framework import serializers
from shipping.models import Shipment
from users.models import ClientProfile, User
from .models import Invoice, Payment
from shipping.serializers import ShipmentSerializer 

class PaymentSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Payment
        fields = ['id', 'amount', 'payment_date', 'payment_method']

class InvoiceSerializer(serializers.ModelSerializer):
   
    shipment_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True
    )
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=User.Role.CLIENT), source='client', write_only=True
    )
   
    shipments = ShipmentSerializer(many=True, read_only=True)

    montant_ht = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    montant_tva = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    montant_ttc = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Invoice
        fields = [
           'id', 'shipments', 'client_id', 'client_id', 'status', 'issued_date', 'due_date',
            'shipment_ids', 'montant_ht', 'montant_tva', 'montant_ttc'
        ]
        

    def create(self, validated_data):
        shipment_ids = validated_data.pop('shipment_ids')
        client = validated_data.get('client')

        
        invoice = Invoice.objects.create(**validated_data)

        
        shipments_to_update = Shipment.objects.filter(id__in=shipment_ids, client=client, invoice__isnull=True)
        shipments_to_update.update(invoice=invoice)

        
        client_profile = ClientProfile.objects.get(user=client)
        client_profile.balance += invoice.montant_ttc # increase client debt
        client_profile.save()
        
        return invoice
