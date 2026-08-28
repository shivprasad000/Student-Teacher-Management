import axios from "axios";

const API_BASE = "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE,
});

// Attach the JWT access token (if we have one) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Student {
  id: number;
  name: string;
  roll_no: number;
  address: string;
  course: string;
  email: string;
  mobile: string;
  photo?: string | null;
}

export interface Teacher {
  id: number;
  name: string;
  subject: string;
  qualification: string;
  email: string;
  mobile: string;
}

export const studentsApi = {
  list: (q?: string) => api.get<Student[]>("/students/", { params: { q } }),
  create: (data: FormData) =>
    api.post<Student>("/students/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id: number, data: FormData) =>
    api.patch<Student>(`/students/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: (id: number) => api.delete(`/students/${id}/`),
};

export const teachersApi = {
  list: (q?: string) => api.get<Teacher[]>("/teachers/", { params: { q } }),
  create: (data: Partial<Teacher>) => api.post<Teacher>("/teachers/", data),
  update: (id: number, data: Partial<Teacher>) =>
    api.patch<Teacher>(`/teachers/${id}/`, data),
  remove: (id: number) => api.delete(`/teachers/${id}/`),
};

export const authApi = {
  loginWithPassword: (username: string, password: string) =>
    api.post<{ access: string; refresh: string }>("/auth/token/", {
      username,
      password,
    }),
  loginWithGoogle: (credential: string) =>
    api.post<{ access: string; refresh: string; is_admin: boolean; email: string }>(
      "/auth/google/",
      { credential }
    ),
};
