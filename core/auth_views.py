from django.contrib.auth.models import User
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings


# Emails allowed to become admin (staff) via Google login.
# Anyone else who signs in with Google gets a normal (guest-level) account.
GOOGLE_ADMIN_EMAILS = getattr(settings, "GOOGLE_ADMIN_EMAILS", [])


@api_view(["POST"])
@permission_classes([AllowAny])
def google_login(request):
    """
    Frontend sends: { "credential": "<Google ID token from @react-oauth/google>" }
    We verify it with Google, find-or-create the Django user, and return
    our own JWT pair (access + refresh) -- same shape as normal login.
    """
    token = request.data.get("credential")
    if not token:
        return Response({"detail": "Missing Google credential."}, status=400)

    try:
        idinfo = id_token.verify_oauth2_token(
            token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
        )
    except ValueError:
        return Response({"detail": "Invalid Google token."}, status=401)

    email = idinfo.get("email")
    if not email:
        return Response({"detail": "Google account has no email."}, status=400)

    user, created = User.objects.get_or_create(
        username=email,
        defaults={
            "email": email,
            "first_name": idinfo.get("given_name", ""),
            "last_name": idinfo.get("family_name", ""),
        },
    )

    # Only pre-approved emails get admin (staff) rights on first login.
    if created and email in GOOGLE_ADMIN_EMAILS:
        user.is_staff = True
        user.save()

    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "is_admin": user.is_staff or user.is_superuser,
            "email": user.email,
        }
    )
