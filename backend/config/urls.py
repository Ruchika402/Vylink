from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from images.views import RegisterView, UserView, DashboardStatsView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('images.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/user/', UserView.as_view(), name='user'),
    path('api/dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
]