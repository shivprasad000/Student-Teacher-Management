from django.contrib import admin
from .models import Student, Teacher

# ----------------- STUDENT -----------------
@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('roll_no', 'name', 'course', 'email', 'mobile')
    search_fields = ('name', 'roll_no', 'email', 'course')
    list_filter = ('course',)
    ordering = ('roll_no',)

# ----------------- TEACHER -----------------
@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'qualification', 'email', 'mobile')
    search_fields = ('name', 'subject', 'email')
    list_filter = ('subject',)
    ordering = ('name',)
