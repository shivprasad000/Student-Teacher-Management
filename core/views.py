from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.db.models import Q
from .models import Student, Teacher
from .forms import StudentForm, TeacherForm
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.shortcuts import redirect



# Admin check
def is_admin(user):
    return user.is_staff or user.is_superuser

# ----------------- STUDENT VIEWS -----------------
@login_required
def student_list(request):
    query = request.GET.get('q')
    if query:
        students = Student.objects.filter(
            Q(name__icontains=query) |
            Q(roll_no__icontains=query) |
            Q(course__icontains=query) |
            Q(email__icontains=query)
        )
    else:
        students = Student.objects.all()
    return render(request, "core/student_list.html", {"students": students})

@login_required
@user_passes_test(is_admin)
def student_create(request):
    form = StudentForm(request.POST or None, request.FILES or None)
    if form.is_valid():
        form.save()
        return redirect('student_list')
    return render(request, "core/student_form.html", {"form": form})

@login_required
@user_passes_test(is_admin)
def student_update(request, pk):
    student = get_object_or_404(Student, pk=pk)
    form = StudentForm(request.POST or None, request.FILES or None, instance=student)
    if form.is_valid():
        form.save()
        return redirect('student_list')
    return render(request, "core/student_form.html", {"form": form})

@login_required
@user_passes_test(is_admin)
def student_delete(request, pk):
    student = get_object_or_404(Student, pk=pk)
    student.delete()
    return redirect('student_list')


# ----------------- TEACHER VIEWS -----------------
@login_required
def teacher_list(request):
    query = request.GET.get('q')
    if query:
        teachers = Teacher.objects.filter(
            Q(name__icontains=query) |
            Q(subject__icontains=query) |
            Q(qualification__icontains=query) |
            Q(email__icontains=query)
        )
    else:
        teachers = Teacher.objects.all()
    return render(request, "core/teacher_list.html", {"teachers": teachers})

@login_required
@user_passes_test(is_admin)
def teacher_create(request):
    form = TeacherForm(request.POST or None)
    if form.is_valid():
        form.save()
        return redirect('teacher_list')
    return render(request, "core/teacher_form.html", {"form": form})

@login_required
@user_passes_test(is_admin)
def teacher_update(request, pk):
    teacher = get_object_or_404(Teacher, pk=pk)
    form = TeacherForm(request.POST or None, instance=teacher)
    if form.is_valid():
        form.save()
        return redirect('teacher_list')
    return render(request, "core/teacher_form.html", {"form": form})

@login_required
@user_passes_test(is_admin)
def teacher_delete(request, pk):
    teacher = get_object_or_404(Teacher, pk=pk)
    teacher.delete()
    return redirect('teacher_list')

from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Landing page
def home(request):
    return render(request, "core/home.html")

from django.shortcuts import render

def home(request):
    return render(request, "core/home.html")

def guest_login(request):
    guest_user = User.objects.get(username='guest')
    login(request, guest_user)  # automatically logs in
    return redirect('student_list')  # redirect to student list page

