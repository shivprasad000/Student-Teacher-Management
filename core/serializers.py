from rest_framework import serializers
from .models import Student, Teacher


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id", "name", "roll_no", "address",
            "course", "email", "mobile", "photo",
        ]


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = [
            "id", "name", "subject", "qualification",
            "email", "mobile",
        ]
