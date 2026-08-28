import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { studentsApi, Student, api } from "../api/client";

const COURSE_CHOICES = ["BSc", "MSc", "BCom", "BA", "BTech", "MTech"];

export default function StudentForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    roll_no: "",
    address: "",
    course: COURSE_CHOICES[0],
    email: "",
    mobile: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api.get<Student>(`/students/${id}/`).then((res) => {
      const s = res.data;
      setForm({
        name: s.name,
        roll_no: String(s.roll_no),
        address: s.address,
        course: s.course,
        email: s.email,
        mobile: s.mobile,
      });
      setExistingPhotoUrl(s.photo ?? null);
    });
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const data = new FormData();
    data.append("name", form.name);
    data.append("roll_no", form.roll_no);
    data.append("address", form.address);
    data.append("course", form.course);
    data.append("email", form.email);
    data.append("mobile", form.mobile);
    if (photo) data.append("photo", photo);

    try {
      if (isEdit) {
        await studentsApi.update(Number(id), data);
      } else {
        await studentsApi.create(data);
      }
      navigate("/students");
    } catch (err: any) {
      const detail = err?.response?.data;
      setError(
        typeof detail === "object" ? JSON.stringify(detail) : "Could not save student."
      );
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>{isEdit ? "Edit Student" : "Add Student"}</h2>

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <label>Roll No</label>
        <input
          name="roll_no"
          type="number"
          value={form.roll_no}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <label>Address</label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <label>Course</label>
        <select
          name="course"
          value={form.course}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        >
          {COURSE_CHOICES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

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

        <label>Photo</label>
        {existingPhotoUrl && !photo && (
          <div style={{ marginBottom: 8 }}>
            <img src={existingPhotoUrl} alt="current" width={80} />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          style={{ marginBottom: 12 }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" style={{ padding: 8 }}>
            Save
          </button>
          <button type="button" onClick={() => navigate("/students")} style={{ padding: 8 }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
