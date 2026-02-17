/** Minimum viewport width (px) required for the 3D experience */
export const DESKTOP_MIN_WIDTH = 900;

/** Route paths */
export const ROUTES = {
  HOME: "/",
  THREE_D: "/3d",
} as const;

/** Desk object identifiers */
export type DeskObjectId =
  | "monitor"
  | "keyboard"
  | "notebook"
  | "papers"
  | "drawer"
  | "dumbbell"
  | "chess-knight";

/** Modal types */
export type ModalType =
  | "projects"
  | "resume"
  | "about"
  | "chess"
  | "fitness"
  | null;

/** Scene phases */
export type ScenePhase = "gate" | "loading" | "desk" | "focused";

/** Tuple type alias for 3D coordinates */
export type Vec3 = [number, number, number];

/** Object metadata: labels, camera targets, and placeholder geometry */
export interface DeskObjectConfig {
  label: string;
  cameraTarget: Vec3;
  cameraPosition: Vec3;
  /** World position of the object on/around the desk */
  position: Vec3;
  /** Primitive geometry dimensions [width, height, depth] */
  placeholderSize: Vec3;
  /** Placeholder color */
  color: string;
  /** Optional GLB model path — if set, loads model instead of primitive */
  modelUrl?: string;
  /** Which modal this object opens (null for drawer which has no modal) */
  modal: ModalType;
  /** Whether this object is hidden until revealed (e.g., inside drawer) */
  hiddenByDefault?: boolean;
}

export const DESK_OBJECTS: Record<DeskObjectId, DeskObjectConfig> = {
  monitor: {
    label: "MONITOR",
    cameraTarget: [0, 1.2, -0.5],
    cameraPosition: [0, 1.2, 0.3],
    position: [0, 1.15, -0.4],
    placeholderSize: [0.6, 0.4, 0.05],
    color: "#333333",
    modal: null,
  },
  keyboard: {
    label: "KEYBOARD",
    cameraTarget: [0, 0.78, 0.1],
    cameraPosition: [0, 1.5, 0.8],
    position: [0, 0.76, 0.15],
    placeholderSize: [0.45, 0.02, 0.15],
    color: "#555555",
    modal: "projects",
  },
  notebook: {
    label: "NOTEBOOK",
    cameraTarget: [-0.5, 0.8, -0.1],
    cameraPosition: [-0.5, 1.4, 0.6],
    position: [-0.5, 0.77, -0.1],
    placeholderSize: [0.2, 0.03, 0.28],
    color: "#2244aa",
    modal: "about",
  },
  papers: {
    label: "PAPERS",
    cameraTarget: [0.5, 0.8, -0.1],
    cameraPosition: [0.5, 1.4, 0.6],
    position: [0.5, 0.77, -0.1],
    placeholderSize: [0.21, 0.02, 0.29],
    color: "#eeeeee",
    modal: "resume",
  },
  drawer: {
    label: "DRAWER",
    cameraTarget: [0, 0.4, 0.2],
    cameraPosition: [0, 0.8, 0.9],
    position: [0, 0.4, 0.3],
    placeholderSize: [0.5, 0.12, 0.35],
    color: "#8B4513",
    modal: null,
  },
  dumbbell: {
    label: "DUMBBELL",
    cameraTarget: [-0.15, 0.35, 0.3],
    cameraPosition: [-0.15, 0.8, 0.9],
    position: [-0.15, 0.35, 0.3],
    placeholderSize: [0.25, 0.06, 0.06],
    color: "#888888",
    modal: "fitness",
    hiddenByDefault: true,
  },
  "chess-knight": {
    label: "CHESS KNIGHT",
    cameraTarget: [0.15, 0.38, 0.3],
    cameraPosition: [0.15, 0.8, 0.9],
    position: [0.15, 0.38, 0.3],
    placeholderSize: [0.06, 0.1, 0.06],
    color: "#222222",
    modal: "chess",
    hiddenByDefault: true,
  },
};

/** Default camera position (seated at desk) */
export const DEFAULT_CAMERA_POSITION: [number, number, number] = [0, 1.4, 2.0];
export const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 0.9, 0];

/** Animation durations in seconds */
export const DURATIONS = {
  CAMERA_FOCUS: 1.2,
  CAMERA_RETURN: 1.0,
  DRAWER_OPEN: 0.8,
  HOVER_DEBOUNCE_MS: 120,
} as const;

/** Asset paths */
export const ASSETS = {
  DESK_MODEL: "/models/computer_desk.glb",
  RESUME_PDF: "/Adam-Porbanderwalla-Resume.pdf",
} as const;
