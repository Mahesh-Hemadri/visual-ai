"use client";

import { motion } from "motion/react";

type StageProps = {
  title: string;
  children: React.ReactNode;
};

export default function Stage({
  title,
  children,
}: StageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
        {title}
      </div>

      <div>{children}</div>
    </motion.div>
  );
}