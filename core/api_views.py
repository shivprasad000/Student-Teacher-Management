from django.db.models import Q
from rest_framework import viewsets

from .models import Student, Teacher
from .serializers import StudentSerializer, TeacherSerializer
from .permissions import IsAdminOrReadOnly


class StudentViewSet(viewsets.ModelViewSet):
    """
    /api/students/            GET (list, ?q=search), POST (admin only)
    /api/students/<pk>/       GET, PUT/PATCH (admin only), DELETE (admin only)
    """
    serializer_class = StudentSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Student.objects.all().order_by("roll_no")
        query = self.request.query_params.get("q")
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query)
                | Q(roll_no__icontains=query)
                | Q(course__icontains=query)
                | Q(email__icontains=query)
            )
        return queryset


class TeacherViewSet(viewsets.ModelViewSet):
    """
    /api/teachers/             GET (list, ?q=search), POST (admin only)
    /api/teachers/<pk>/        GET, PUT/PATCH (admin only), DELETE (admin only)
    """
    serializer_class = TeacherSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Teacher.objects.all().order_by("name")
        query = self.request.query_params.get("q")
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query)
                | Q(subject__icontains=query)
                | Q(qualification__icontains=query)
                | Q(email__icontains=query)
            )
        return queryset
