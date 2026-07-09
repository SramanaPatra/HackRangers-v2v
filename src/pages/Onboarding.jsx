import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, setToken } from "../api/client.js";

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "it_professional", label: "IT Professional" },
  { value: "homemaker", label: "Homemaker" },
  { value: "other", label: "Other" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    age: "",
    role: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.age || form.age < 13 || form.age > 120) nextErrors.age = "Enter a valid age";
    if (!form.role) nextErrors.role = "Select a role";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (!form.password || form.password.length < 8) nextErrors.password = "Password must be at least 8 characters";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = await apiRequest("/onboarding/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setToken(data.token);
      navigate("/");
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-driftIn max-w-md mx-auto">
      <p className="eyebrow mb-2">Welcome</p>
      <h1 className="text-3xl font-medium mb-8">Let's set you up.</h1>

      <form onSubmit={handleSubmit} className="card flex flex-col gap-5">
        <div>
          <label className="text-sm font-medium mb-1 block">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-petal-soft rounded-2xl px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blossom/40"
          />
          {errors.name && <p className="text-xs text-blossom-dark mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Age</label>
          <input
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="w-full bg-petal-soft rounded-2xl px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blossom/40"
          />
          {errors.age && <p className="text-xs text-blossom-dark mt-1">{errors.age}</p>}
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Role</label>
          <div className="grid grid-cols-2 gap-2">
            {roleOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => setForm({ ...form, role: option.value })}
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  form.role === option.value ? "bg-blossom text-white" : "bg-petal-soft text-ink"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.role && <p className="text-xs text-blossom-dark mt-1">{errors.role}</p>}
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-petal-soft rounded-2xl px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blossom/40"
          />
          {errors.email && <p className="text-xs text-blossom-dark mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-petal-soft rounded-2xl px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blossom/40"
          />
          {errors.password && <p className="text-xs text-blossom-dark mt-1">{errors.password}</p>}
        </div>

        {errors.form && <p className="text-xs text-blossom-dark">{errors.form}</p>}

        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-40">
          {submitting ? "Creating account..." : "Continue"}
        </button>
      </form>
    </div>
  );
}