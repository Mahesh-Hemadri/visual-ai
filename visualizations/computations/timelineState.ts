import { TimelineAction } from "@/types/visualization";

export function isActionActive(
  timeline: TimelineAction[],
  action: string,
  target: string,
  currentTime: number
): boolean {
  return timeline.some(
    (item) =>
      item.action === action &&
      item.target === target &&
      currentTime >= item.at
  );
}

export function getActiveAction(
  timeline: TimelineAction[],
  target: string,
  currentTime: number
): TimelineAction | undefined {
  const actions = timeline.filter(
    (item) =>
      item.target === target &&
      currentTime >= item.at
  );

  if (actions.length === 0) {
    return undefined;
  }

  return actions[actions.length - 1];
}