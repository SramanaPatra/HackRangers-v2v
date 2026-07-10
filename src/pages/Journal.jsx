import { useState, useEffect } from "react";
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

const moodByValue = Object.fromEntries(moods.map((m) => [m.value, m]));

export default function Journal() {
  const [mood, setMood] = useState(null);
  const [tags, setTags] = useState([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);

  const loadEntries = async () => {
    setLoadingEntries(true);
    try {
      const data = await apiRequest("/mood/entries?days=30");
      // API returns ascending by date; show most recent first
      setEntries([...data].reverse());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingEntries(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

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
      setNote("");
      setTags([]);
      await loadEntries();
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

      <div className="mt-10">
        <p className="font-medium mb-4">Past entries</p>

        {loadingEntries && <p className="text-sm text-ink/50">Loading...</p>}

        {!loadingEntries && entries.length === 0 && (
          <p className="text-sm text-ink/50">No entries yet — your check-ins will show up here.</p>
        )}

        <div className="flex flex-col gap-3">
          {entries.map((entry) => {
            const m = moodByValue[entry.mood_score];
            return (
              <div key={entry.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{m?.emoji}</span>
                    <span className="font-medium text-sm">{m?.label}</span>
                  </div>
                  <span className="text-xs text-ink/50">{entry.entry_date}</span>
                </div>

                {entry.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full text-xs bg-petal-soft text-ink/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {entry.note && <p className="text-sm text-ink/70">{entry.note}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}