from rest_framework import viewsets, status, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.contrib.auth.models import User
from django.db import models
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import timedelta

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import Image
from .serializers import UserSerializer, ImageSerializer, UserRegistrationSerializer


# ========== RATE LIMIT EXCEEDED HANDLER ==========
def rate_limit_exceeded(request, exception):
    """Custom response when rate limit is exceeded.
    Must be registered in settings.py as RATELIMIT_VIEW
    so django_ratelimit returns 429 instead of DRF's default 403.
    """
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
            image.expires_at = timezone.now() + timedelta(days=expires_in)
            image.save(update_fields=['expires_at'])
        else:
            image.expires_at = None
            image.save(update_fields=['expires_at'])

        # Return the frontend share URL, not the API URL
        FRONTEND_URL = settings.FRONTEND_URL

        return Response({
            "shareable_link": link,
            "full_url": f"{FRONTEND_URL}/s/{link}",        # Frontend page
            "api_url": request.build_absolute_uri(f'/api/images/share/{link}/'),
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
    """Public share endpoint. Anyone with the link can view the image metadata
    and receive a short-lived pre-signed URL. JSON response only — the frontend
    renders the actual <img> from the signed URL.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, link):
        # 1. Handle missing links properly (404, not 500)
        try:
            image = Image.objects.get(shareable_link=link)
        except Image.DoesNotExist:
            return Response(
                {"error": "This share link does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        # 2. Check expiry
        if image.expires_at and timezone.now() > image.expires_at:
            return Response(
                {"error": "This link has expired"},
                status=status.HTTP_410_GONE
            )

        # 3. Increment view count
        image.increment_view_count()
        image.refresh_from_db()

        # 4. Serialize — the serializer generates the pre-signed S3 URL
        serializer = ImageSerializer(image, context={'request': request})
        return Response(serializer.data)


# ========== AUTH VIEWS ==========
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        soon = now + timedelta(hours=24)

        user_images = Image.objects.filter(owner=request.user)

        total_files = user_images.count()

        # Active links = files with a shareable link that hasn't expired yet
        active_links = user_images.filter(
            shareable_link__isnull=False,
            expires_at__gt=now
        ).count()

        total_views = (
            user_images.aggregate(sum=models.Sum('view_count'))['sum'] or 0
        )

        # Expiring soon = links expiring in the next 24 hours
        expiring_soon = user_images.filter(
            shareable_link__isnull=False,
            expires_at__gt=now,
            expires_at__lte=soon
        ).count()

        return Response({
            'total_files': total_files,
            'active_links': active_links,
            'total_views': total_views,
            'expiring_soon': expiring_soon,
        })


# ========== COOKIE JWT VIEWS ==========
class CookieTokenObtainPairView(TokenObtainPairView):
    """Login endpoint.

    - AllowAny so unauthenticated users can log in.
    - csrf_exempt so the POST isn't rejected before the view runs.
      (Cookie JWT auth uses SameSite=Lax for CSRF defense, which is
      sufficient for this SPA setup — see README threat model.)
    - ratelimit: 5 attempts per minute per IP. If RATELIMIT_VIEW is
      registered in settings, the response is 429, not 403.
    """
    permission_classes = [AllowAny]

    @method_decorator(csrf_exempt)
    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST', block=True))
    def post(self, request, *args, **kwargs):
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
                max_age=900,          # 15 minutes
            )
        if refresh:
            response.set_cookie(
                'refresh_token',
                refresh,
                httponly=True,
                samesite='Lax',
                secure=not settings.DEBUG,
                max_age=604800,       # 7 days
            )

        return response


class CookieTokenRefreshView(TokenRefreshView):
    """Refresh endpoint. AllowAny so the refresh cookie can be exchanged
    for a new access token without requiring an existing access token."""
    permission_classes = [AllowAny]

    @method_decorator(csrf_exempt)
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
        response = super().post(request, *args, **kwargs)

        # Rotate the access cookie if a new one came back
        access = response.data.get('access')
        if access:
            response.set_cookie(
                'access_token',
                access,
                httponly=True,
                samesite='Lax',
                secure=not settings.DEBUG,
                max_age=900,
            )
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({'message': 'Logged out'})
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response