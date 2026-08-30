from django.utils.deprecation import MiddlewareMixin

class SecurityHeadersMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        # ✅ X-Content-Type-Options
        response['X-Content-Type-Options'] = 'nosniff'
        
        # ✅ X-Frame-Options
        response['X-Frame-Options'] = 'DENY'
        
        # ✅ Referrer-Policy
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # ✅ Permissions-Policy (optional)
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        
        return response