import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentsApi, Student } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [query, setQuery] = useState("");
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const load = async (q?: string) => {
    const res = await studentsApi.list(q);
    setStudents(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(query);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this student?")) return;
    await studentsApi.remove(id);
    load(query);
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Students</h2>

      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input
          placeholder="Search by name, roll no, course, email..."
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
            onClick={() => navigate("/students/new")}
            style={{ padding: 8, marginLeft: 8 }}
          >
            + Add Student
          </button>
        )}
      </form>

      <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
            <th>Roll No</th>
            <th>Name</th>
            <th>Course</th>
            <th>Email</th>
            <th>Mobile</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{s.roll_no}</td>
              <td>{s.name}</td>
              <td>{s.course}</td>
              <td>{s.email}</td>
              <td>{s.mobile}</td>
              {isAdmin && (
                <td style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => navigate(`/students/${s.id}/edit`)}>Edit</button>
                  <button onClick={() => handleDelete(s.id)}>Delete</button>
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
