# images/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

class JWTCookieAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Try to get the token from the 'access_token' cookie
        raw_token = request.COOKIES.get(settings.SIMPLE_JWT.get('JWT_ACCESS_COOKIE_NAME', 'access_token'))
        
        if raw_token is None:
            return None
        
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token