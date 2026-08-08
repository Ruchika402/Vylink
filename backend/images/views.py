from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from .models import Image
from .serializers import ImageSerializer

class ImageViewSet(viewsets.ModelViewSet):
    serializer_class = ImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Fix OWASP A01: Broken Access Control - Users only see their own images"""
        return Image.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        """Set the owner to the current user"""
        serializer.save(owner=self.request.user)
    
    @method_decorator(ratelimit(key='user', rate='10/m', method='POST', block=True))
    def create(self, request, *args, **kwargs):
        """Rate limit image uploads to prevent abuse"""
        return super().create(request, *args, **kwargs)
    
    @action(detail=True, methods=['get'])
    def share(self, request, pk=None):
        """Generate a shareable link for an image"""
        image = self.get_object()
        
        # Fix OWASP A01: Ensure user owns the image
        if image.owner != request.user:
            return Response(
                {"error": "You don't have permission to share this image"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Generate unique shareable link (simplified for now)
        import uuid
        shareable_link = str(uuid.uuid4())[:8]
        image.shareable_link = shareable_link
        image.save(update_fields=['shareable_link'])
        
        # Cache the shareable link for performance
        cache.set(f'share_{shareable_link}', image.id, timeout=86400)  # 24 hours
        
        return Response({"shareable_link": shareable_link})
    
    @action(detail=False, methods=['get'])
    def public(self, request):
        """View public images (no authentication required)"""
        public_images = Image.objects.filter(is_public=True)
        serializer = self.get_serializer(public_images, many=True)
        return Response(serializer.data)