import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import StudentList from "./pages/StudentList";
import StudentForm from "./pages/StudentForm";
import TeacherList from "./pages/TeacherList";
import TeacherForm from "./pages/TeacherForm";
import Nav from "./components/Nav";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Only admins may reach add/edit forms; guests get bounced back to the list.
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/students" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <StudentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/new"
          element={
            <AdminRoute>
              <StudentForm />
            </AdminRoute>
          }
        />
        <Route
          path="/students/:id/edit"
          element={
            <AdminRoute>
              <StudentForm />
            </AdminRoute>
          }
        />

        <Route
          path="/teachers"
          element={
            <ProtectedRoute>
              <TeacherList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers/new"
          element={
            <AdminRoute>
              <TeacherForm />
            </AdminRoute>
          }
        />
        <Route
          path="/teachers/:id/edit"
          element={
            <AdminRoute>
              <TeacherForm />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
