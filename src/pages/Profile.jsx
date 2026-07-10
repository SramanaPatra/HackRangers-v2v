import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, getToken } from "../api/client.js";

const ROLE_LABELS = {
  student: "Student",
  it_professional: "IT Professional",
  homemaker: "Homemaker",
  other: "Other",
};

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", age: "", phone: "", role: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/users/me")
      .then((data) => {
        setUser(data);
        setForm({
          name: data.name || "",
          age: data.age || "",
          phone: data.phone || "",
          role: data.role || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setStatus("Could not load profile.");
        setLoading(false);
      });
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave(e) {
    e.preventDefault();
    setStatus("Saving...");
    try {
      const updated = await apiRequest("/users/me", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      setUser(updated);
      setStatus("Saved.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("mindease_token");
    navigate("/onboarding");
  }

  if (loading) {
    return <p className="font-body text-ink/60">Loading profile...</p>;
  }

  return (
    <div className="max-w-lg">
      <p className="font-body text-xs tracking-widest text-blossom uppercase mb-1">
        Account
      </p>
      <h1 className="font-display text-3xl text-ink mb-6">Your profile</h1>

      <form
        onSubmit={handleSave}
        className="bg-petal-soft rounded-2xl p-6 flex flex-col gap-4 shadow-lift"
      >
        <label className="flex flex-col gap-1 font-body text-sm text-ink/70">
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="rounded-full px-4 py-2 bg-cream border border-ink/10"
          />
        </label>

        <label className="flex flex-col gap-1 font-body text-sm text-ink/70">
          Age
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            className="rounded-full px-4 py-2 bg-cream border border-ink/10"
          />
        </label>

        <label className="flex flex-col gap-1 font-body text-sm text-ink/70">
          Phone
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="rounded-full px-4 py-2 bg-cream border border-ink/10"
          />
        </label>

        <label className="flex flex-col gap-1 font-body text-sm text-ink/70">
          Role
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="rounded-full px-4 py-2 bg-cream border border-ink/10"
          >
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <p className="font-body text-sm text-ink/50">Email: {user.email}</p>

        <button
          type="submit"
          className="self-start bg-blossom text-white rounded-full px-6 py-2 font-body text-sm font-medium shadow-lift"
        >
          Save changes
        </button>

        {status && <p className="font-body text-sm text-ink/60">{status}</p>}
      </form>

      <button
        onClick={handleLogout}
        className="mt-6 text-sm font-body text-blossom underline"
      >
        Log out
      </button>
    </div>
  );
}