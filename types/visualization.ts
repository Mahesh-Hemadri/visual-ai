export type Position = {
  x: number;
  y: number;
};

export type VisualObject =
  | {
      id: string;
      type: "text";
      label: string;
      position?: Position;
    }
  | {
      id: string;
      type: "token";
      label: string;
      position?: Position;
    }
  | {
      id: string;
      type: "node";
      label: string;
      position?: Position;
    }
  | {
      id: string;
      type: "number";
      label: string;
      value: number;
      position?: Position;
    }
  | {
      id: string;
      type: "arrow";
      from: string;
      to: string;
      label?: string;
    };

export type TimelineAction = {
  at: number;
  duration?: number;

  action:
    | "appear"
    | "disappear"
    | "highlight"
    | "move"
    | "connect"
    | "flow"
    | "flow_layer";

  target?: string;
  from?: string;
  to?: string;

  fromLayer?: string;
  toLayer?: string;

  position?: Position;
};

export type VisualizationScene = {
  objects: VisualObject[];
  timeline: TimelineAction[];
};

export type Visualization = {
  title: string;
  subtitle: string;
  scenes: VisualizationScene[];
};