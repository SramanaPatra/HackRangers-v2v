import { useState } from "react";
import { motion } from "framer-motion";
import { apiRequest } from "../api/client.js";

const moods = [
  { value: 1, emoji: "😔", label: "Rough" },
  { value: 2, emoji: "😕", label: "Low" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
];

const tagOptions = [
  "Deadline stress", "Imposter syndrome", "Team conflict",
  "Long hours", "Good feedback", "Learning something new", "Isolation",
];

export default function Journal() {
  const [mood, setMood] = useState(null);
  const [tags, setTags] = useState([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const toggleTag = (tag) =>
    setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]));

  const handleSave = async () => {
    if (!mood) return;
    setSaving(true);
    setError("");

    try {
      await apiRequest("/mood/entries", {
        method: "POST",
        body: JSON.stringify({
          moodScore: mood,
          tags,
          note,
          entryDate: new Date().toISOString().slice(0, 10),
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-driftIn max-w-2xl">
      <p className="eyebrow mb-2">Daily check-in</p>
      <h1 className="text-3xl font-medium mb-8">How are you, really?</h1>

      <div className="card mb-6">
        <p className="font-medium mb-4">Today I feel...</p>
        <div className="flex justify-between gap-2">
          {moods.map((m) => (
            <motion.button
              key={m.value}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMood(m.value)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl transition-colors ${
                mood === m.value ? "bg-blossom text-white shadow-lift" : "bg-petal-soft hover:bg-white"
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-xs font-medium">{m.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="card mb-6">
        <p className="font-medium mb-4">What's contributing to that?</p>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                tags.includes(tag)
                  ? "bg-sage text-white border-sage"
                  : "bg-transparent border-ink/15 text-ink/70 hover:border-sage"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="card mb-6">
        <p className="font-medium mb-4">Anything you want to put into words?</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="Optional — this stays private to you."
          className="w-full bg-petal-soft rounded-2xl p-4 text-sm font-body resize-none
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-blossom/40"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={!mood || saving}
        className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "Save today's entry"}
      </button>

      {saved && (
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-4 text-sage-dark text-sm font-medium"
        >
          Saved. See you tomorrow 🌸
        </motion.span>
      )}

      {error && <p className="text-blossom-dark text-sm mt-3">{error}</p>}
    </div>
  );
}