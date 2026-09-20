"use client";

type Props = {
  currentStep: number;
  totalSteps: number;
  playing: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onPlayPause: () => void;
};

export default function TimelineControls({
  currentStep,
  totalSteps,
  playing,
  onPrevious,
  onNext,
  onPlayPause,
}: Props) {
  const progress =
    totalSteps > 1
      ? (currentStep / (totalSteps - 1)) * 100
      : 0;

  return (
    <div className="mx-auto mt-8 max-w-4xl">

      {/* Progress bar */}

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-blue-400 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {/* Controls */}

      <div className="flex items-center justify-between">

        <button
          type="button"
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Previous
        </button>

        <button
          type="button"
          onClick={onPlayPause}
          className="rounded-xl bg-blue-500 px-6 py-2 text-sm font-medium transition hover:bg-blue-400"
        >
          {playing ? "Pause" : "▶ Play"}
        </button>

        <div className="text-sm text-gray-500">
          {currentStep + 1} / {totalSteps}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next →
        </button>

      </div>
    </div>
  );
}