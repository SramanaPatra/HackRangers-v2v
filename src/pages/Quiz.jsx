import { useState } from "react";
import { motion } from "framer-motion";

const questions = [
  "I feel drained by the end of most workdays.",
  "I've been more cynical about my work lately.",
  "I struggle to focus, even on things I usually enjoy.",
  "I feel like my efforts go unnoticed.",
  "I've been sleeping worse than usual.",
];

const scale = [
  { value: 1, label: "Never" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Always" },
];

function resultFor(score) {
  if (score <= 10) return { label: "You seem to be doing okay", tone: "sage", tip: "Keep checking in with yourself — small, regular pauses go a long way." };
  if (score <= 17) return { label: "Some signs of strain", tone: "spark", tip: "Consider a guided exercise today, and maybe talk to someone you trust." };
  return { label: "Significant signs of burnout", tone: "blossom", tip: "This is worth taking seriously — consider reaching out to a counselor or your manager about workload." };
}

export default function Quiz() {
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const score = Object.values(answers).reduce((a, b) => a + b, 0);
  const allAnswered = Object.keys(answers).length === questions.length;
  const result = resultFor(score);

  return (
    <div className="animate-driftIn max-w-2xl">
      <p className="eyebrow mb-2">Burnout check-in</p>
      <h1 className="text-3xl font-medium mb-8">A gentle self-check.</h1>

      {!done ? (
        <>
          <div className="flex flex-col gap-5 mb-6">
            {questions.map((q, i) => (
              <div key={i} className="card">
                <p className="font-medium mb-4">{q}</p>
                <div className="flex gap-2 flex-wrap">
                  {scale.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setAnswers((a) => ({ ...a, [i]: s.value }))}
                      className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors ${
                        answers[i] === s.value
                          ? "bg-blossom text-white border-blossom"
                          : "border-ink/15 text-ink/60 hover:border-blossom/40"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            disabled={!allAnswered}
            onClick={() => setDone(true)}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            See my result
          </button>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card text-center py-12">
          <p className="eyebrow mb-3">Your result</p>
          <h2 className="text-2xl font-medium mb-3">{result.label}</h2>
          <p className="text-ink-light max-w-sm mx-auto mb-6">{result.tip}</p>
          <p className="text-xs text-ink-light/70 mb-6">
            This is a self-reflection tool, not a diagnosis. If you're struggling, please reach out to a mental health professional.
          </p>
          <button onClick={() => { setDone(false); setAnswers({}); }} className="btn-ghost">
            Retake later
          </button>
        </motion.div>
      )}
    </div>
  );
}
