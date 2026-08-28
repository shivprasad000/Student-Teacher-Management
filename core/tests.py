from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status

from .models import Student, Teacher


class StudentAPITests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="admin", password="pass1234", is_staff=True
        )
        self.student = Student.objects.create(
            name="Asha Rao",
            roll_no=101,
            address="Pune",
            course="MSc",
            email="asha@example.com",
            mobile="9999900000",
        )

    def test_guest_can_list_students(self):
        """Anonymous (guest) users can read the student list."""
        response = self.client.get("/api/students/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_guest_cannot_create_student(self):
        """Anonymous users are blocked from write operations."""
        payload = {
            "name": "New Student",
            "roll_no": 102,
            "address": "Pune",
            "course": "BSc",
            "email": "new@example.com",
            "mobile": "9999911111",
        }
        response = self.client.post("/api/students/", payload)
        self.assertIn(
            response.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )

    def test_admin_can_create_student(self):
        """Authenticated staff users can create students."""
        self.client.force_authenticate(user=self.admin)
        payload = {
            "name": "New Student",
            "roll_no": 102,
            "address": "Pune",
            "course": "BSc",
            "email": "new@example.com",
            "mobile": "9999911111",
        }
        response = self.client.post("/api/students/", payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Student.objects.count(), 2)

    def test_admin_can_delete_student(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f"/api/students/{self.student.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Student.objects.count(), 0)

    def test_search_filters_by_name(self):
        Student.objects.create(
            name="Rohit Sharma",
            roll_no=103,
            address="Mumbai",
            course="BTech",
            email="rohit@example.com",
            mobile="9999922222",
        )
        response = self.client.get("/api/students/", {"q": "Asha"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Asha Rao")


class TeacherAPITests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="admin2", password="pass1234", is_staff=True
        )
        self.teacher = Teacher.objects.create(
            name="Dr. Mehta",
            subject="Computer Science",
            qualification="PhD",
            mobile="8888800000",
            email="mehta@example.com",
        )

    def test_guest_can_list_teachers(self):
        response = self.client.get("/api/teachers/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_guest_cannot_update_teacher(self):
        response = self.client.patch(
            f"/api/teachers/{self.teacher.id}/", {"subject": "Maths"}
        )
        self.assertIn(
            response.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )

    def test_admin_can_update_teacher(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f"/api/teachers/{self.teacher.id}/", {"subject": "Maths"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.teacher.refresh_from_db()
        self.assertEqual(self.teacher.subject, "Maths")


class AuthAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="staffuser", password="pass1234")

    def test_jwt_login_with_valid_credentials(self):
        response = self.client.post(
            "/api/auth/token/", {"username": "staffuser", "password": "pass1234"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_jwt_login_with_invalid_credentials(self):
        response = self.client.post(
            "/api/auth/token/", {"username": "staffuser", "password": "wrongpass"}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_google_login_missing_credential_returns_400(self):
        response = self.client.post("/api/auth/google/", {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
