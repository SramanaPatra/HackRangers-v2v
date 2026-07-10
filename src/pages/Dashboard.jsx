import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import MoodExportButton from "../components/MoodExportButton.jsx";

const sampleData = [
  { day: "Mon", date: "2026-07-06", mood: 3 },
  { day: "Tue", date: "2026-07-07", mood: 2 },
  { day: "Wed", date: "2026-07-08", mood: 3 },
  { day: "Thu", date: "2026-07-09", mood: 4 },
  { day: "Fri", date: "2026-07-10", mood: 3 },
  { day: "Sat", date: "2026-07-11", mood: 5 },
  { day: "Sun", date: "2026-07-12", mood: 4 },
];
export default function Dashboard() {
  const avg = (sampleData.reduce((s, d) => s + d.mood, 0) / sampleData.length).toFixed(1);
  const streak = 4;

  return (
    <div className="animate-driftIn">
      <p className="eyebrow mb-2">Your trends</p>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-medium">The last 7 days.</h1>
        <MoodExportButton
         entries={sampleData.map((d) => ({ date: d.date, moodScore: d.mood }))}
          userName="You"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="card">
          <p className="text-ink-light text-sm mb-1">Average mood</p>
          <p className="font-mono text-4xl text-blossom-dark">{avg}<span className="text-lg text-ink-light">/5</span></p>
        </div>
        <div className="card">
          <p className="text-ink-light text-sm mb-1">Check-in streak</p>
          <p className="font-mono text-4xl text-sage-dark">{streak}<span className="text-lg text-ink-light"> days</span></p>
        </div>
      </div>

      <div className="card">
        <p className="font-medium mb-6">Mood over time</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={sampleData} margin={{ left: -20 }}>
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
    </div>
  );
}