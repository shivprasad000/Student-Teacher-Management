from django.db import models


class Student(models.Model):
    COURSE_CHOICES = [
        ('BSc', 'BSc'),
        ('MSc', 'MSc'),
        ('BCom', 'BCom'),
        ('BA', 'BA'),
        ('BTech', 'BTech'),
        ('MTech', 'MTech'),
    ]

    name = models.CharField(max_length=100)
    roll_no = models.PositiveIntegerField(unique=True)
    address = models.TextField()
    course = models.CharField(max_length=20, choices=COURSE_CHOICES)  # 👈 updated
    email = models.EmailField(unique=True)
    mobile = models.CharField(max_length=10)
    photo = models.ImageField(upload_to="student_photos/", null=True, blank=True)


    def __str__(self):
        return f"{self.name} ({self.roll_no})"


class Teacher(models.Model):
    name = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    qualification = models.CharField(max_length=100)
    mobile = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name
