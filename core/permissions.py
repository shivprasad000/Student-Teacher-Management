from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Mirrors the old is_admin() check from views.py:
    - Anyone (including guests) can read (GET/HEAD/OPTIONS).
    - Only staff/superusers can create, update, or delete.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user
        return bool(user and user.is_authenticated and (user.is_staff or user.is_superuser))
