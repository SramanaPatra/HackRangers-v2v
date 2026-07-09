import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import BreathingBloom from "../components/BreathingBloom.jsx";

const goals = [
  "Reduce daily stress",
  "Sleep better",
  "Feel less isolated at work",
  "Manage imposter syndrome",
];

export default function Home() {
  const [selectedGoals, setSelectedGoals] = useState([]);

  const toggleGoal = (goal) =>
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );

  return (
    <div className="animate-driftIn">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <BreathingBloom size="lg" animate label="MindEase breathing bloom, gently expanding and contracting" />
        <div>
          <p className="eyebrow mb-3">For women building careers in STEM</p>
          <h1 className="text-4xl md:text-5xl font-medium mb-4 leading-tight">
            A quiet place to catch<br className="hidden md:block" /> your breath.
          </h1>
          <p className="text-ink-light text-lg mb-6 max-w-md">
            MindEase is a space to check in with yourself, breathe through the
            hard days, and find people who get it — built for the specific
            pressures of engineering, labs, and late-night deploys.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link to="/journal" className="btn-primary">Start today's check-in</Link>
            <Link to="/exercises" className="btn-ghost">Try a breathing exercise</Link>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-medium mb-4">What brings you here today?</h2>
        <p className="text-ink-light mb-5 text-sm">
          Pick what feels true right now — you can change this anytime.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {goals.map((goal) => {
            const isSelected = selectedGoals.includes(goal);
            return (
              <motion.button
                key={goal}
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -2 }}
                onClick={() => toggleGoal(goal)}
                aria-pressed={isSelected}
                className={`flex items-center justify-between text-left px-5 py-4 rounded-2xl border transition-colors font-body text-sm font-medium ${
                  isSelected
                    ? "bg-blossom text-white border-blossom shadow-lift"
                    : "border-ink/10 bg-petal-soft hover:border-blossom/40 hover:bg-white"
                }`}
              >
                <span>{goal}</span>
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded-full border shrink-0 ml-3 transition-colors ${
                    isSelected ? "bg-white border-white" : "border-ink/20"
                  }`}
                >
                  {isSelected && <Check size={13} className="text-blossom" strokeWidth={3} />}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {selectedGoals.length > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-ink-light text-sm mt-4"
        >
          Got it — we'll shape your check-ins around{" "}
          <span className="text-blossom-dark font-medium">
            {selectedGoals.length} goal{selectedGoals.length > 1 ? "s" : ""}
          </span>.
        </motion.p>
      )}
    </div>
  );
}