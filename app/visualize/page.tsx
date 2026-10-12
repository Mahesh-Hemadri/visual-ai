
import { Suspense } from "react";
import VisualizeClient from "./VisualizeClient";

export default function VisualizePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
          <p>Loading visualization...</p>
        </main>
      }
    >
      <VisualizeClient />
    </Suspense>
  );
}
