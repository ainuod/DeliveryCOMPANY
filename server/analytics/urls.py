from django.urls import path
from .views import DashboardAnalyticsView

urlpatterns = [
    #
    path('analytics/dashboard/', DashboardAnalyticsView.as_view(), name='dashboard-analytics'),
]
