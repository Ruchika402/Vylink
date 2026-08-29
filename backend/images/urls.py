# images/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ImageViewSet, PublicShareView, DashboardStatsView

router = DefaultRouter()
router.register(r'images', ImageViewSet, basename='image')

urlpatterns = [
    path('', include(router.urls)),
    path('images/share/<str:link>/', PublicShareView.as_view(), name='public_share'),
    # REMOVED: path('dashboard/stats/', ...) because it's in config/urls.py
]