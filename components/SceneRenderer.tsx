"use client";

import { motion } from "motion/react";
import {
  VisualObject,
  VisualizationScene,
} from "@/types/visualization";

type Props = {
  scene: VisualizationScene;
  currentTime: number;
};

function hasStarted(
  object: VisualObject,
  scene: VisualizationScene,
  currentTime: number
) {
  const action = scene.timeline.find(
    (item) =>
      item.action === "appear" &&
      item.target === object.id
  );

  if (!action) {
    return true;
  }

  return currentTime >= action.at;
}

function isHighlighted(
  object: VisualObject,
  scene: VisualizationScene,
  currentTime: number
) {
  return scene.timeline.some(
    (item) =>
      item.action === "highlight" &&
      item.target === object.id &&
      currentTime >= item.at
  );
}

function isConnected(
  from: string,
  to: string,
  scene: VisualizationScene,
  currentTime: number
) {
  return scene.timeline.some(
    (item) =>
      item.action === "connect" &&
      item.from === from &&
      item.to === to &&
      currentTime >= item.at
  );
}

function isFlowing(
  from: string,
  to: string,
  scene: VisualizationScene,
  currentTime: number
) {
  return scene.timeline.some(
    (item) =>
      item.action === "flow" &&
      item.from === from &&
      item.to === to &&
      currentTime >= item.at
  );
}

function getNodeCenter(object: VisualObject) {
  return {
    x: (object.position?.x ?? 0) + 40,
    y: (object.position?.y ?? 0) + 40,
  };
}

export default function SceneRenderer({
  scene,
  currentTime,
}: Props) {
  const visibleObjects = scene.objects.filter((object) =>
    hasStarted(object, scene, currentTime)
  );

  const nodes = visibleObjects.filter(
    (object) => object.type === "node"
  );

  const explicitConnections = scene.timeline.filter(
    (item) =>
        item.action === "connect" &&
        item.from &&
        item.to &&
        currentTime >= item.at
    );

    const layerConnections = scene.timeline
    .filter(
        (item) =>
        item.action === "flow_layer" &&
        item.fromLayer &&
        item.toLayer &&
        currentTime >= item.at
    )
    .flatMap((flow) => {
        const fromNodes = nodes.filter((node) =>
        node.id.startsWith(`${flow.fromLayer}-`)
        );

        const toNodes = nodes.filter((node) =>
        node.id.startsWith(`${flow.toLayer}-`)
        );

        return fromNodes.flatMap((fromNode) =>
        toNodes.map((toNode) => ({
            from: fromNode.id,
            to: toNode.id,
            at: flow.at,
        }))
        );
    });

    const connections = [
    ...explicitConnections,
    ...layerConnections,
    ];

  return (
    <div className="relative min-h-[500px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20">

      {/* CONNECTIONS */}

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        {connections.map((connection, index) => {
          const fromNode = nodes.find(
            (node) => node.id === connection.from
          );

          const toNode = nodes.find(
            (node) => node.id === connection.to
          );

          if (!fromNode || !toNode) {
            return null;
          }

          const from = getNodeCenter(fromNode);
          const to = getNodeCenter(toNode);

          const flowing =
            isFlowing(
                connection.from!,
                connection.to!,
                scene,
                currentTime
            ) ||
            scene.timeline.some(
                (item) =>
                item.action === "flow_layer" &&
                item.fromLayer &&
                item.toLayer &&
                connection.from?.startsWith(
                    `${item.fromLayer}-`
                ) &&
                connection.to?.startsWith(
                    `${item.toLayer}-`
                ) &&
                currentTime >= item.at
            );

          return (
            <g key={`${connection.from}-${connection.to}-${index}`}>

              <motion.line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.5,
                }}
                stroke="rgba(139, 92, 246, 0.45)"
                strokeWidth="2"
              />

              <motion.polygon
                points={`${to.x},${to.y} ${to.x - 10},${to.y - 5} ${to.x - 10},${to.y + 5}`}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.5,
                }}
                fill="rgba(139, 92, 246, 0.8)"
              />

              {flowing && (
                <motion.circle
                  r="7"
                  fill="white"
                  initial={{
                    cx: from.x,
                    cy: from.y,
                    opacity: 0,
                  }}
                  animate={{
                    cx: to.x,
                    cy: to.y,
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

            </g>
          );
        })}
      </svg>

      {/* OBJECTS */}

      {visibleObjects.map((object) => {
        const highlighted = isHighlighted(
          object,
          scene,
          currentTime
        );

        if (object.type === "node") {
          return (
            <motion.div
              key={object.id}
              initial={{
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                opacity: 1,
                scale: highlighted ? 1.15 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 18,
              }}
              className={`absolute flex h-20 w-20 items-center justify-center rounded-full border text-sm transition-colors ${
                highlighted
                  ? "border-yellow-400 bg-yellow-400/20 text-yellow-200"
                  : "border-purple-400/40 bg-purple-400/10 text-purple-200"
              }`}
              style={{
                left: object.position?.x ?? 50,
                top: object.position?.y ?? 50,
              }}
            >
              {object.label}
            </motion.div>
          );
        }

        if (object.type === "text") {
          return (
            <motion.div
              key={object.id}
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
              }}
              className="absolute rounded-xl border border-white/10 bg-white/5 px-6 py-4"
              style={{
                left: object.position?.x ?? 50,
                top: object.position?.y ?? 50,
              }}
            >
              {object.label}
            </motion.div>
          );
        }

        if (object.type === "token") {
          return (
            <motion.div
              key={object.id}
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
              }}
              className="absolute rounded-xl border border-blue-400/30 bg-blue-400/10 px-5 py-3 text-blue-200"
              style={{
                left: object.position?.x ?? 50,
                top: object.position?.y ?? 50,
              }}
            >
              {object.label}
            </motion.div>
          );
        }

        if (object.type === "number") {
          return (
            <motion.div
              key={object.id}
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
              }}
              className="absolute rounded-xl border border-green-400/30 bg-green-400/10 px-5 py-3 text-green-200"
              style={{
                left: object.position?.x ?? 50,
                top: object.position?.y ?? 50,
              }}
            >
              <div className="text-xs text-gray-500">
                {object.label}
              </div>

              <div className="mt-1 text-xl font-semibold">
                {object.value}
              </div>
            </motion.div>
          );
        }

        return null;
      })}
    </div>
  );
}