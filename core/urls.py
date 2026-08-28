from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('students/', views.student_list, name='student_list'),
    path('teachers/', views.teacher_list, name='teacher_list'),

    path('student/add/', views.student_create, name='student_create'),
    path('student/<int:pk>/edit/', views.student_update, name='student_update'),
    path('student/<int:pk>/delete/', views.student_delete, name='student_delete'),

    path('teacher/add/', views.teacher_create, name='teacher_create'),
    path('teacher/<int:pk>/edit/', views.teacher_update, name='teacher_update'),
    path('teacher/<int:pk>/delete/', views.teacher_delete, name='teacher_delete'),

    path('login/', auth_views.LoginView.as_view(template_name="core/login.html"), name="login"),
    path('logout/', auth_views.LogoutView.as_view(next_page="login"), name="logout"),
]
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),  # Landing page
    path('guest-login/', views.guest_login, name='guest_login'),  # One-click guest login
    path('students/', views.student_list, name='student_list'),
    path('student/add/', views.student_create, name='student_create'),
    path('student/<int:pk>/edit/', views.student_update, name='student_update'),
    path('student/<int:pk>/delete/', views.student_delete, name='student_delete'),
    path('teachers/', views.teacher_list, name='teacher_list'),
    path('teacher/add/', views.teacher_create, name='teacher_create'),
    path('teacher/<int:pk>/edit/', views.teacher_update, name='teacher_update'),
    path('teacher/<int:pk>/delete/', views.teacher_delete, name='teacher_delete'),
]

