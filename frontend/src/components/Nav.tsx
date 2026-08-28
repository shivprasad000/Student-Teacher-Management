import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Nav() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        gap: 16,
        padding: 12,
        borderBottom: "1px solid #ddd",
        fontFamily: "sans-serif",
        alignItems: "center",
      }}
    >
      <Link to="/students">Students</Link>
      <Link to="/teachers">Teachers</Link>
      <span style={{ marginLeft: "auto", color: "#666" }}>
        {isAdmin ? "Admin" : "Guest"}
      </span>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
