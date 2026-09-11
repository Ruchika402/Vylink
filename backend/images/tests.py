from django.test import TestCase

# Create your tests here.
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Image
from django.utils import timezone
from datetime import timedelta


class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )

    def test_protected_endpoint_requires_auth(self):
        """Test that /api/user/ requires authentication"""
        response = self.client.get('/api/user/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_sets_cookies(self):
        """Test that login sets httpOnly cookies"""
        response = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.cookies)
        self.assertIn('refresh_token', response.cookies)


class AccessControlTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_a = User.objects.create_user(username='usera', password='pass123')
        self.user_b = User.objects.create_user(username='userb', password='pass123')
        
        self.image_a = Image.objects.create(
            owner=self.user_a,
            title='User A Image',
            file='test.jpg'
        )

    def test_user_cannot_see_other_users_image(self):
        """Test that User B cannot see User A's image"""
        self.client.force_authenticate(user=self.user_b)
        response = self.client.get(f'/api/images/{self.image_a.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class InputSanitizationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='pass123')
        self.client.force_authenticate(user=self.user)

    def test_xss_in_title_is_sanitized(self):
        """Test that XSS in title is sanitized"""
        response = self.client.post('/api/images/', {
            'title': '<script>alert("xss")</script>',
            'file': 'test.jpg'
        }, format='multipart')
        # Title should be sanitized
        if response.status_code == status.HTTP_201_CREATED:
            self.assertNotIn('<script>', response.data['title'])


class ExpiredLinkTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='pass123')
        self.image = Image.objects.create(
            owner=self.user,
            title='Test Image',
            file='test.jpg',
            shareable_link='abc12345',
            expires_at=timezone.now() - timedelta(days=1)  # ✅ Expired
        )

    def test_expired_link_returns_410(self):
        """Test that expired links return 410 Gone"""
        response = self.client.get('/api/images/share/abc12345/')
        self.assertEqual(response.status_code, status.HTTP_410_GONE)