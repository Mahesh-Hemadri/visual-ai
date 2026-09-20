"use client";

import { motion } from "motion/react";

type TokenProps = {
  value: string;
  index?: number;
  color?: "blue" | "purple" | "green";
};

export default function Token({
  value,
  index = 0,
  color = "blue",
}: TokenProps) {
  const colorStyles = {
    blue: "border-blue-400/30 bg-blue-400/10 text-blue-200",
    purple:
      "border-purple-400/30 bg-purple-400/10 text-purple-200",
    green:
      "border-green-400/30 bg-green-400/10 text-green-200",
  };

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.85,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        delay: index * 0.08,
        type: "spring",
        stiffness: 250,
        damping: 18,
      }}
      className={`rounded-xl border px-5 py-3 text-lg ${colorStyles[color]}`}
    >
      {value}
    </motion.div>
  );
}