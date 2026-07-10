import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import MoodExportButton from "../components/MoodExportButton.jsx";
import { apiRequest } from "../api/client.js";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [entriesData, streakData] = await Promise.all([
          apiRequest("/mood/entries?days=7"),
          apiRequest("/mood/streak"),
        ]);
        setEntries(entriesData);
        setStreak(streakData.streak);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const chartData = entries.map((e) => ({
    day: new Date(e.entry_date).toLocaleDateString(undefined, { weekday: "short" }),
    mood: e.mood_score,
  }));

  const avg = entries.length
    ? (entries.reduce((s, e) => s + e.mood_score, 0) / entries.length).toFixed(1)
    : "—";

  if (loading) {
    return <p className="text-ink-light text-sm">Loading your trends...</p>;
  }

  if (error) {
    return <p className="text-blossom-dark text-sm">{error}</p>;
  }

  return (
    <div className="animate-driftIn">
      <p className="eyebrow mb-2">Your trends</p>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-3xl font-medium">The last 7 days.</h1>
        <MoodExportButton
          entries={entries.map((e) => ({
            date: e.entry_date,
            moodScore: e.mood_score,
            note: e.note,
          }))}
          userName="You"
        />
      </div>

      {entries.length === 0 ? (
        <div className="card">
          <p className="text-ink-light text-sm">
            No check-ins yet — your trends will appear here once you log a mood in the Journal.
          </p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="card">
              <p className="text-ink-light text-sm mb-1">Average mood</p>
              <p className="font-mono text-4xl text-blossom-dark">
                {avg}<span className="text-lg text-ink-light">/5</span>
              </p>
            </div>
            <div className="card">
              <p className="text-ink-light text-sm mb-1">Check-in streak</p>
              <p className="font-mono text-4xl text-sage-dark">
                {streak}<span className="text-lg text-ink-light"> days</span>
              </p>
            </div>
          </div>

          <div className="card">
            <p className="font-medium mb-6">Mood over time</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData} margin={{ left: -20 }}>
                <CartesianGrid stroke="#4A1D2E" strokeOpacity={0.06} vertical={false} />
                <XAxis dataKey="day" stroke="#4A1D2E" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[1, 5]} stroke="#4A1D2E" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 8px 30px -8px rgba(74,29,46,0.25)" }}
                />
                <Line type="monotone" dataKey="mood" stroke="#D6336C" strokeWidth={3} dot={{ r: 5, fill: "#D6336C" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}