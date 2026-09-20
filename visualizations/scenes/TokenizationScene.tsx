"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Props = {
  step: number;
};

const tokens = [
  {
    id: "the",
    text: "The",
    tokenId: 464,
  },
  {
    id: "cat",
    text: "cat",
    tokenId: 3797,
  },
  {
    id: "is",
    text: "is",
    tokenId: 318,
  },
  {
    id: "sleep",
    text: "sleep",
    tokenId: 535,
  },
  {
    id: "ing",
    text: "ing",
    tokenId: 278,
  },
];

export default function TokenizationScene({ step }: Props) {
  const showTokens = step >= 1;
  const showIds = step >= 2;

  return (
    <div className="flex min-h-[400px] w-full items-center justify-center">

      <motion.div
        layout
        className="flex flex-wrap items-center justify-center gap-3"
      >

        {/* THE */}

        <motion.div
          layout
          transition={{
            layout: {
              type: "spring",
              stiffness: 180,
              damping: 20,
            },
          }}
          className={
            showTokens
              ? "rounded-xl border border-blue-400/30 bg-blue-400/10 px-5 py-3 text-lg text-blue-200"
              : "text-2xl text-white"
          }
        >
          {showIds && (
            <div className="flex flex-col items-center">
              <span>The</span>

              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-purple-300"
              >
                464
              </motion.span>
            </div>
          )}

          {!showIds && "The"}
        </motion.div>

        {/* CAT */}

        <motion.div
          layout
          transition={{
            layout: {
              type: "spring",
              stiffness: 180,
              damping: 20,
            },
          }}
          className={
            showTokens
              ? "rounded-xl border border-blue-400/30 bg-blue-400/10 px-5 py-3 text-lg text-blue-200"
              : "text-2xl text-white"
          }
        >
          {showIds ? (
            <div className="flex flex-col items-center">
              <span>cat</span>

              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-purple-300"
              >
                3797
              </motion.span>
            </div>
          ) : (
            "cat"
          )}
        </motion.div>

        {/* IS */}

        <motion.div
          layout
          transition={{
            layout: {
              type: "spring",
              stiffness: 180,
              damping: 20,
            },
          }}
          className={
            showTokens
              ? "rounded-xl border border-blue-400/30 bg-blue-400/10 px-5 py-3 text-lg text-blue-200"
              : "text-2xl text-white"
          }
        >
          {showIds ? (
            <div className="flex flex-col items-center">
              <span>is</span>

              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-purple-300"
              >
                318
              </motion.span>
            </div>
          ) : (
            "is"
          )}
        </motion.div>

        {/* SLEEP / ING */}

        <AnimatePresence mode="popLayout">

          {!showTokens && (
            <motion.div
              layout
              initial={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 0.8,
              }}
              transition={{ duration: 0.3 }}
              className="text-2xl text-white"
            >
              sleeping
            </motion.div>
          )}

          {showTokens && (
            <>
              <motion.div
                layout
                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.7,
                }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 18,
                }}
                className="rounded-xl border border-blue-400/30 bg-blue-400/10 px-5 py-3 text-lg text-blue-200"
              >
                {showIds ? (
                  <div className="flex flex-col items-center">
                    <span>sleep</span>

                    <motion.span
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="mt-2 text-sm text-purple-300"
                    >
                      535
                    </motion.span>
                  </div>
                ) : (
                  "sleep"
                )}
              </motion.div>

              <motion.div
                layout
                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 0.12,
                  type: "spring",
                  stiffness: 220,
                  damping: 18,
                }}
                className="rounded-xl border border-blue-400/30 bg-blue-400/10 px-5 py-3 text-lg text-blue-200"
              >
                {showIds ? (
                  <div className="flex flex-col items-center">
                    <span>ing</span>

                    <motion.span
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="mt-2 text-sm text-purple-300"
                    >
                      278
                    </motion.span>
                  </div>
                ) : (
                  "ing"
                )}
              </motion.div>
            </>
          )}

        </AnimatePresence>

      </motion.div>
    </div>
  );
}