from rest_framework import serializers
from .models import Image
from django.contrib.auth.models import User

class ImageSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Image
        fields = [
            'id', 'title', 'description', 'file', 'file_url',
            'thumbnail', 'file_size', 'mime_type', 'view_count',
            'is_public', 'shareable_link', 'uploaded_at',
            'owner_username'
        ]
        read_only_fields = ['owner', 'view_count', 'shareable_link', 'uploaded_at']
    
    def get_file_url(self, obj):
        """Return file URL (will be pre-signed S3 URL in production)"""
        request = self.context.get('request')
        if request and obj.file:
            return request.build_absolute_uri(obj.file.url)
        return None
    
    def validate_title(self, value):
        """Prevent XSS by validating title"""
        if any(char in value for char in '<>"{}/'):
            raise serializers.ValidationError("Title contains invalid characters.")
        return value

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email','first_name', 'last_name', 'date_joined']
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'confirm_password', 'first_name', 'last_name']

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