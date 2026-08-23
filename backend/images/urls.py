from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ImageViewSet, PublicShareView, UserView, DashboardStatsView

router = DefaultRouter()
router.register(r'images', ImageViewSet, basename='image')

urlpatterns = [
    path('', include(router.urls)),
    path('user/', UserView.as_view(), name='user'),
    path('images/share/<str:link>/', PublicShareView.as_view(), name='public_share'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
]