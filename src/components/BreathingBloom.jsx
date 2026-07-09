import { motion } from "framer-motion";

/**
 * Signature visual motif for MindEase — a layered "bloom" of petals.
 * Used three ways across the app:
 *   1. size="sm"  — as a section marker / bullet, replacing generic numbering
 *      (content here isn't a sequence, so numbers 01/02/03 would be misleading)
 *   2. size="md"  — as a loading / empty-state indicator
 *   3. size="lg" animate — as the actual breathing-exercise pacer, where the
 *      bloom's expand/contract cycle IS the exercise instruction.
 */
const PETAL_COLORS = ["#D6336C", "#F06595", "#E8A33D", "#7C9885"];

export default function BreathingBloom({ size = "sm", animate = false, label }) {
  const dims = { sm: 28, md: 64, lg: 220 }[size];
  const petalCount = { sm: 4, md: 5, lg: 6 }[size];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: dims, height: dims }}
      role={animate ? "img" : undefined}
      aria-label={label || (animate ? "Breathing pacer, expands on inhale, contracts on exhale" : undefined)}
    >
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = (360 / petalCount) * i;
        const offset = dims * 0.22;
        return (
          <motion.div
            key={i}
            className="absolute rounded-bloom"
            style={{
              width: dims * 0.55,
              height: dims * 0.55,
              background: PETAL_COLORS[i % PETAL_COLORS.length],
              opacity: 0.75,
              transform: `rotate(${angle}deg) translate(${offset}px) rotate(-${angle}deg)`,
            }}
            animate={
              animate
                ? { scale: [0.85, 1.15, 0.85], opacity: [0.6, 0.9, 0.6] }
                : {}
            }
            transition={
              animate
                ? { duration: 8, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }
                : {}
            }
          />
        );
      })}
      <div
        className="absolute rounded-bloom bg-cream"
        style={{ width: dims * 0.35, height: dims * 0.35 }}
      />
    </div>
  );
}
