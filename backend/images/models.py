from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import os

def image_upload_path(instance, filename):
    """Organize uploads in user-specific folders"""
    return f'users/{instance.owner.id}/{timezone.now().strftime("%Y/%m/%d")}/{filename}'

class Image(models.Model):
    owner = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='images'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to=image_upload_path)
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    file_size = models.PositiveIntegerField(help_text="Size in bytes", null=True, blank=True)
    mime_type = models.CharField(max_length=100, null=True, blank=True)
    view_count = models.PositiveIntegerField(default=0)
    is_public = models.BooleanField(default=False)
    shareable_link = models.CharField(max_length=255, unique=True, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['owner', '-uploaded_at']),
            models.Index(fields=['shareable_link']),
        ]
    
    def __str__(self):
        return f"{self.title} by {self.owner.username}"

    def generate_shareable_link(self):
        """Generate a unique shareable link"""
        import uuid
        link = str(uuid.uuid4())[:8]
        while Image.objects.filter(shareable_link=link).exists():
            link = str(uuid.uuid4())[:8]
        self.shareable_link = link
        self.save(update_fields=['shareable_link'])
        return link
    
    def increment_view_count(self):
        """Increment view count atomically"""
        self.view_count = models.F('view_count') + 1
        self.save(update_fields=['view_count'])
    
    def get_file_extension(self):
        return os.path.splitext(self.file.name)[1] if self.file else ''