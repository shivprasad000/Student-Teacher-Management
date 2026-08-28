import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teachersApi, Teacher } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function TeacherList() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [query, setQuery] = useState("");
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const load = async (q?: string) => {
    const res = await teachersApi.list(q);
    setTeachers(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(query);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this teacher?")) return;
    await teachersApi.remove(id);
    load(query);
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Teachers</h2>

      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input
          placeholder="Search by name, subject, qualification, email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, width: 320 }}
        />
        <button type="submit" style={{ padding: 8, marginLeft: 8 }}>
          Search
        </button>
        {isAdmin && (
          <button
            type="button"
            onClick={() => navigate("/teachers/new")}
            style={{ padding: 8, marginLeft: 8 }}
          >
            + Add Teacher
          </button>
        )}
      </form>

      <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
            <th>Name</th>
            <th>Subject</th>
            <th>Qualification</th>
            <th>Email</th>
            <th>Mobile</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{t.name}</td>
              <td>{t.subject}</td>
              <td>{t.qualification}</td>
              <td>{t.email}</td>
              <td>{t.mobile}</td>
              {isAdmin && (
                <td style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => navigate(`/teachers/${t.id}/edit`)}>Edit</button>
                  <button onClick={() => handleDelete(t.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {!isAdmin && (
        <p style={{ color: "#666", marginTop: 16 }}>
          You're viewing as Guest (read-only).
        </p>
      )}
    </div>
  );
}
