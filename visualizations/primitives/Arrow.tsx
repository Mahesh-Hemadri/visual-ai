"use client";

import { motion } from "motion/react";

type ArrowProps = {
  direction?: "down" | "right" | "left" | "up";
  label?: string;
};

export default function Arrow({
  direction = "down",
  label,
}: ArrowProps) {
  const symbols = {
    down: "↓",
    right: "→",
    left: "←",
    up: "↑",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 18,
      }}
      className="flex flex-col items-center justify-center gap-1 text-gray-500"
    >
      <span className="text-3xl">
        {symbols[direction]}
      </span>

      {label && (
        <span className="text-xs text-gray-500">
          {label}
        </span>
      )}
    </motion.div>
  );
}