from rest_framework import serializers
from .models import Image
from django.contrib.auth.models import User
#from django.core.files.storage import default_storage
import bleach

class ImageSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Image
        fields = [
            'id', 'title', 'description', 'file', 'file_url',
            'thumbnail', 'file_size', 'mime_type', 'view_count',
            'is_public', 'shareable_link', 'uploaded_at', 'updated_at',
            'expires_at', 'owner_username'
        ]
        read_only_fields = ['owner', 'view_count', 'shareable_link', 'uploaded_at', 'updated_at']
    
    def get_file_url(self, obj):
        """Return file URL"""
        if obj.file:
            try:
                return obj.file.url
            except:
                return None
        return None
    
    def validate_title(self, value):
        """Sanitize title to prevent XSS"""
        sanitized = bleach.clean(value, strip=True)
        if not sanitized:
            raise serializers.ValidationError("Title cannot be empty or contain only invalid characters.")
        if any(char in sanitized for char in '<>"{}/'):
            raise serializers.ValidationError("Title contains invalid characters.")
        return sanitized
    
    def validate_description(self, value):
        """Sanitize description to prevent XSS"""
        if value:
            sanitized = bleach.clean(value, strip=True)
            return sanitized
        return value


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'confirm_password', 'first_name', 'last_name']

    def validate_username(self, value):
        """Sanitize username"""
        sanitized = bleach.clean(value, strip=True)
        if not sanitized or len(sanitized) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters.")
        return sanitized

    def validate_first_name(self, value):
        if value:
            return bleach.clean(value, strip=True)
        return value

    def validate_last_name(self, value):
        if value:
            return bleach.clean(value, strip=True)
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user