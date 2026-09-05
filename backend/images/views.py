from rest_framework import viewsets, status, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from .models import Image
from .serializers import UserSerializer, ImageSerializer, UserRegistrationSerializer
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db import models 
import uuid
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage

# ========== RATE LIMIT EXCEEDED HANDLER ==========
def rate_limit_exceeded(request, exception):
    """Custom response when rate limit is exceeded"""
    return JsonResponse(
        {"error": "Too many requests. Please try again later."},
        status=429
    )


# ========== IMAGE VIEWSET ==========
class ImageViewSet(viewsets.ModelViewSet):
    serializer_class = ImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Users can only see their own images"""
        return Image.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        """Set owner automatically and extract file metadata"""
        file = self.request.FILES.get('file')
        is_public = self.request.data.get('is_public', 'false').lower() == 'true'
        
        if file:
            serializer.save(
                owner=self.request.user,
                file_size=file.size,
                mime_type=file.content_type,
                is_public=is_public
            )
        else:
            serializer.save(
                owner=self.request.user,
                is_public=is_public
            )
    
    @method_decorator(ratelimit(key='user', rate='10/m', method='POST', block=True))
    def create(self, request, *args, **kwargs):
        """Rate limit uploads: 10 per minute per user"""
        return super().create(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    @method_decorator(ratelimit(key='user', rate='20/m', method='POST', block=True))
    def share(self, request, pk=None):
        """Generate a shareable link with rate limiting: 20 per minute"""
        image = self.get_object()
        
        if image.owner != request.user:
            return Response(
                {"error": "You don't have permission to share this image"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        expires_in = request.data.get('expires_in', 7)
        link = image.generate_shareable_link()
        
        if expires_in and expires_in > 0:
            from django.utils import timezone
            from datetime import timedelta
            image.expires_at = timezone.now() + timedelta(days=expires_in)
            image.save(update_fields=['expires_at'])
        else:
            image.expires_at = None
            image.save(update_fields=['expires_at'])
        
        return Response({
            "shareable_link": link,
            "full_url": request.build_absolute_uri(f'/api/images/share/{link}/'),
            "expires_at": image.expires_at,
            "expires_in": expires_in if expires_in > 0 else "Never"
        })
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def public(self, request):
        public_images = Image.objects.filter(is_public=True)[:20]
        serializer = self.get_serializer(public_images, many=True)
        return Response(serializer.data)


# ========== PUBLIC SHARE VIEW ==========
class PublicShareView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, link):
        from django.utils import timezone
        
        image = get_object_or_404(Image, shareable_link=link)
        
        if image.expires_at and timezone.now() > image.expires_at:
            return Response(
                {"error": "This link has expired"},
                status=status.HTTP_410_GONE
            )
        
        image.increment_view_count()
        file_url = None
        if image.file:
            try:
                file_url = default_storage.url(image.file.name)
            except Exception as e:
                print(f"Error generating pre-signed URL: {e}")
        
        serializer = ImageSerializer(image, context={'request': request})
        data = serializer.data
        data['file_url'] = file_url  # ✅ Add pre-signed URL to response
        
        return Response(data)


# ========== AUTH VIEWS ==========
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        print("🔍 Received data:", request.data)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User created successfully",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }
            }, status=status.HTTP_201_CREATED)
        print("❌ Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        from .models import Image
        
        total_files = Image.objects.filter(owner=request.user).count()
        public_files = Image.objects.filter(owner=request.user, is_public=True).count()
        total_views = Image.objects.filter(owner=request.user).aggregate(sum=models.Sum('view_count'))['sum'] or 0
        
        return Response({
            'total_files': total_files,
            'active_links': public_files,
            'total_views': total_views,
            'expiring_soon': 0,
        })


# ========== COOKIE JWT VIEWS ==========
class CookieTokenObtainPairView(TokenObtainPairView):
    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST', block=True))
    def post(self, request, *args, **kwargs):
        """Rate limit login: 5 attempts per minute per IP"""
        response = super().post(request, *args, **kwargs)
        access = response.data.get('access')
        refresh = response.data.get('refresh')
        if access:
            response.set_cookie(
                'access_token',
                access,
                httponly=True,
                samesite='Lax',
                secure=not settings.DEBUG,
                max_age=900
            )
        if refresh:
            response.set_cookie(
                'refresh_token',
                refresh,
                httponly=True,
                samesite='Lax',
                secure=not settings.DEBUG,
                max_age=604800
            )
        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {"detail": "Refresh token missing"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        request.data['refresh'] = refresh_token
        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({'message': 'Logged out'})
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response