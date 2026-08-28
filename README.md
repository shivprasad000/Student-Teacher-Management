# Student and Teacher Management System

A full-stack, role-based web application for managing student and teacher records. Built with a Django REST Framework backend and a React + TypeScript frontend, with JWT-based authentication (including Google OAuth) and Docker for containerized deployment.

---

## Features

### Admin
- Add, update, and delete student and teacher records
- Search students and teachers
- Upload student photos
- Login via username/password or Google OAuth
- Full CRUD access, enforced at the API level

### Guest
- View student and teacher records
- Search records
- Read-only access — no login required

---

## Tech Stack

**Backend**
- Python, Django, Django REST Framework
- SimpleJWT (JWT authentication)
- Google OAuth (via `google-auth`)
- PostgreSQL (Docker) / SQLite (local dev)
- django-cors-headers

**Frontend**
- React, TypeScript
- Vite
- React Router
- Axios
- `@react-oauth/google`

**Infra**
- Docker & Docker Compose
- GitHub Actions (CI — runs backend tests on every push)

---

## Architecture

- The frontend and backend are two independent services communicating over HTTP.
- Authentication (password or Google) issues a JWT, attached to every API request.
- Permissions are enforced server-side (`IsAdminOrReadOnly`) — guests can read, only staff/admin users can write.

---

## Data Models

**Student:** Roll Number, Name, Address, Course, Email, Mobile Number, Photo

**Teacher:** Name, Subject, Qualification, Email, Mobile Number

---

## Running Locally

### Option A — Docker (recommended)

```bash
git clone https://github.com/shivprasad000/Student-Teacher-Management
cd Student-Teacher-Management
cp .env.example .env
docker-compose up --build
```

```bash
docker-compose exec backend python manage.py createsuperuser
```

App runs at `http://localhost:5173`, API at `http://localhost:8000/api/`.

### Option B — Manual setup

**Backend**
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## API Endpoints

| Endpoint | Method | Access |
|---|---|---|
| `/api/students/` | GET | Anyone |
| `/api/students/` | POST | Admin only |
| `/api/students/<id>/` | GET, PATCH, DELETE | GET: anyone, PATCH/DELETE: admin only |
| `/api/teachers/` | GET | Anyone |
| `/api/teachers/` | POST | Admin only |
| `/api/teachers/<id>/` | GET, PATCH, DELETE | GET: anyone, PATCH/DELETE: admin only |
| `/api/auth/token/` | POST | Password login → JWT |
| `/api/auth/google/` | POST | Google OAuth login → JWT |

Search supported via `?q=` query param on list endpoints.

---

## Testing

```bash
python manage.py test core
```

---

## Author

**Shivprasad Baraskar**