import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BreathingBloom from "../components/BreathingBloom.jsx";

const exercises = [
  { id: "breathe", title: "4-7-8 Breathing", duration: 120, desc: "Inhale 4s, hold 7s, exhale 8s. Follow the bloom." },
  { id: "ground", title: "2-Minute Grounding", duration: 120, desc: "Name 5 things you see, 4 you can touch, 3 you hear." },
  { id: "scan", title: "Body Scan", duration: 180, desc: "A slow, guided scan from head to toe to release tension." },
];

function Timer({ seconds, running }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (!running) return;
    setLeft(seconds);
    const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running, seconds]);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return <span className="font-mono text-2xl text-ink">{mm}:{ss}</span>;
}

export default function Exercises() {
  const [active, setActive] = useState(null);

  return (
    <div className="animate-driftIn">
      <p className="eyebrow mb-2">Guided exercises</p>
      <h1 className="text-3xl font-medium mb-8">Two minutes is enough.</h1>

      {active ? (
        <div className="card flex flex-col items-center text-center py-14">
          <BreathingBloom size="lg" animate />
          <h2 className="text-xl font-medium mt-8 mb-2">{active.title}</h2>
          <p className="text-ink-light text-sm mb-6 max-w-sm">{active.desc}</p>
          <Timer seconds={active.duration} running={!!active} />
          <button onClick={() => setActive(null)} className="btn-ghost mt-8">
            End session
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {exercises.map((ex) => (
            <motion.button
              key={ex.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActive(ex)}
              className="card text-left flex items-start gap-4"
            >
              <BreathingBloom size="md" />
              <div>
                <h3 className="font-medium mb-1">{ex.title}</h3>
                <p className="text-ink-light text-sm">{ex.desc}</p>
                <span className="font-mono text-xs text-blossom-dark/70 mt-2 inline-block">
                  {Math.round(ex.duration / 60)} min
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
