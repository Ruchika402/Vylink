from rest_framework import viewsets, status, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from .models import Image
from .serializers import UserSerializer, ImageSerializer#, UserRegistrationSerializer
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db import models 
import uuid
class ImageViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for images.
    - GET /api/images/ → List user's images
    - POST /api/images/ → Upload new image
    - GET /api/images/{id}/ → Get single image
    - PUT /api/images/{id}/ → Update image
    - DELETE /api/images/{id}/ → Delete image
    """
    serializer_class = ImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Users can only see their own images"""
        return Image.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        """Set owner automatically and extract file metadata"""
        file = self.request.FILES.get('file')
        if file:
            serializer.save(
                owner=self.request.user,
                file_size=file.size,
                mime_type=file.content_type
            )
        else:
            serializer.save(owner=self.request.user)
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        """Generate a shareable link for an image"""
        image = self.get_object()
        
        # Check ownership
        if image.owner != request.user:
            return Response(
                {"error": "You don't have permission to share this image"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Generate unique link
        link = image.generate_shareable_link()
        return Response({
            "shareable_link": link,
            "full_url": request.build_absolute_uri(f'/api/images/share/{link}/')
        })
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def public(self, request):
        """View public images (no auth required)"""
        public_images = Image.objects.filter(is_public=True)[:20]
        serializer = self.get_serializer(public_images, many=True)
        return Response(serializer.data)

# ========== PUBLIC SHARE VIEW (No Auth) ==========
class PublicShareView(APIView):
    """View a shared image without authentication"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, link):
        image = get_object_or_404(Image, shareable_link=link)
        image.increment_view_count()
        serializer = ImageSerializer(image, context={'request': request})
        return Response(serializer.data)

        
'''
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "message": "User created successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }, status=status.HTTP_201_CREATED)

class CustomLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            })
        else:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
'''
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
            'expiring_soon': 0,  # Add expiry logic later
        })