import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { teachersApi, api, Teacher } from "../api/client";

export default function TeacherForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    subject: "",
    qualification: "",
    email: "",
    mobile: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api.get<Teacher>(`/teachers/${id}/`).then((res) => {
      const t = res.data;
      setForm({
        name: t.name,
        subject: t.subject,
        qualification: t.qualification,
        email: t.email,
        mobile: t.mobile,
      });
    });
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isEdit) {
        await teachersApi.update(Number(id), form);
      } else {
        await teachersApi.create(form);
      }
      navigate("/teachers");
    } catch (err: any) {
      const detail = err?.response?.data;
      setError(
        typeof detail === "object" ? JSON.stringify(detail) : "Could not save teacher."
      );
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>{isEdit ? "Edit Teacher" : "Add Teacher"}</h2>

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <label>Subject</label>
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <label>Qualification</label>
        <input
          name="qualification"
          value={form.qualification}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <label>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <label>Mobile</label>
        <input
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" style={{ padding: 8 }}>
            Save
          </button>
          <button type="button" onClick={() => navigate("/teachers")} style={{ padding: 8 }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
