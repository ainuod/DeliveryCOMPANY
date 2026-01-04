from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from decimal import Decimal
from users.models import User
from shipping.models import Shipment, Tour
from support.models import Claim, Incident
from finance.models import Invoice
from rest_framework.permissions import BasePermission




class IsAdminOrAgent(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in [User.Role.ADMIN, User.Role.AGENT])


class DashboardAnalyticsView(APIView):
    
    #key performance indicators  the system (used for dashboards)
    
    permission_classes = [IsAdminOrAgent]

    def get(self, request, format=None):
        
        total_clients = User.objects.filter(role=User.Role.CLIENT).count()

        shipment_counts_by_status = Shipment.objects.values('status').annotate(count=Count('id'))
        
        tours_in_progress = Tour.objects.filter(status=Tour.TourStatus.IN_PROGRESS).count()

        open_incidents = Incident.objects.filter(status=Incident.IncidentStatus.OPEN).count()

        
        total_revenue = Invoice.objects.filter(status=Invoice.InvoiceStatus.PAID).aggregate(
            total_ht=Sum('amount')
        )['total_ht'] or Decimal('0.00')

        
        outstanding_amount = Invoice.objects.filter(
            Q(status=Invoice.InvoiceStatus.UNPAID) | Q(status=Invoice.InvoiceStatus.OVERDUE)
        ).aggregate(
            total_ht=Sum('amount')
        )['total_ht'] or Decimal('0.00')

        
        latest_shipments = Shipment.objects.order_by('-created_at')[:5]
        latest_claims = Claim.objects.order_by('-created_at')[:5]

        
        from shipping.serializers import ShipmentSerializer
        from support.serializers import ClaimSerializer

        # final data object
        data = {
            'kpis': {
                'total_clients': total_clients,
                'total_revenue': total_revenue,
                'outstanding_amount': outstanding_amount,
                'tours_in_progress': tours_in_progress,
                'open_incidents': open_incidents,
            },
            'shipment_summary': {
                status_item['status']: status_item['count'] for status_item in shipment_counts_by_status
            },
            'recent_activity': {
                'latest_shipments': ShipmentSerializer(latest_shipments, many=True).data,
                'latest_claims': ClaimSerializer(latest_claims, many=True).data
            }
        }
        
        return Response(data)

