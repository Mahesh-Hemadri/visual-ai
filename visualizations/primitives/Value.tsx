"use client";

import { motion } from "motion/react";

type ValueProps = {
  label: string;
  value: number;
  highlighted?: boolean;
};

export default function Value({
  label,
  value,
  highlighted = false,
}: ValueProps) {
  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        scale: highlighted ? 1.08 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 18,
      }}
      className={`min-w-24 rounded-xl border px-5 py-3 text-center ${
        highlighted
          ? "border-yellow-400/40 bg-yellow-400/10"
          : "border-green-400/30 bg-green-400/10"
      }`}
    >
      <div className="text-xs text-gray-500">
        {label}
      </div>

      <motion.div
        key={value}
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mt-1 text-xl font-semibold text-green-200"
      >
        {value.toFixed(2)}
      </motion.div>
    </motion.div>
  );
}