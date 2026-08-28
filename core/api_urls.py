from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .api_views import StudentViewSet, TeacherViewSet
from .auth_views import google_login

router = DefaultRouter()
router.register(r"students", StudentViewSet, basename="student")
router.register(r"teachers", TeacherViewSet, basename="teacher")

urlpatterns = [
    path("", include(router.urls)),

    # Username/password JWT login (existing admin accounts)
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Google OAuth login -> returns the same JWT shape as above
    path("auth/google/", google_login, name="google_login"),
]
