from django.contrib import admin
from .models import Shipment, Parcel, Tour
admin.site.register(Shipment)
admin.site.register(Parcel)
admin.site.register(Tour)
