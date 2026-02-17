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
  | "shaker"
  | "chessboard"
  | "phone";

/** Modal types */
export type ModalType =
  | "projects"
  | "resume"
  | "about"
  | "chess"
  | "fitness"
  | "socials"
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
  /** Optional scale for GLB model */
  scale?: Vec3;
  /** Optional rotation in radians [x, y, z] */
  rotation?: Vec3;
  /** Which modal this object opens (null for monitor which opens terminal) */
  modal: ModalType;
}

export const DESK_OBJECTS: Record<DeskObjectId, DeskObjectConfig> = {
  monitor: {
    label: "MONITOR",
    cameraTarget: [0, 1.2, -0.5],
    cameraPosition: [0, 1.2, 0.3],
    position: [0, 0.355, -1.0],
    placeholderSize: [0.6, 0.4, 0.05],
    color: "#333333",
    modelUrl: "/models/monitor.glb",
    scale: [0.003, 0.003, 0.003],
    rotation: [0, -Math.PI/2, 0],
    modal: null,
  },
  keyboard: {
    label: "KEYBOARD",
    cameraTarget: [0.1, 0.15, -0.25],
    cameraPosition: [0, 1.5, 0.8],
    position: [0.1, 0.15, -0.25],
    placeholderSize: [0.45, 0.02, 0.15],
    color: "#555555",
    modelUrl: "/models/keyboard.glb",
    scale: [5, 5, 5],
    rotation: [0, 0, 0],
    modal: "projects",
  },
  notebook: {
    label: "NOTEBOOK",
    cameraTarget: [-0.5, 0.8, -0.1],
    cameraPosition: [-0.5, 1.4, 0.6],
    position: [-0.5, 0.75, -0.1],
    placeholderSize: [0.2, 0.03, 0.28],
    color: "#2244aa",
    modelUrl: "/models/notebook.glb",
    scale: [0.2, 0.2, 0.2],
    rotation: [0, 0, 0],
    modal: "about",
  },
  papers: {
    label: "PAPERS",
    cameraTarget: [0.5, 0.8, -0.1],
    cameraPosition: [0.5, 1.4, 0.6],
    position: [0.5, 0.75, -0.1],
    placeholderSize: [0.21, 0.02, 0.29],
    color: "#eeeeee",
    modelUrl: "/models/papers.glb",
    scale: [0.3, 0.3, 0.3],
    rotation: [0, 0, 0],
    modal: "resume",
  },
  shaker: {
    label: "PROTEIN SHAKER",
    cameraTarget: [1.35, 0.1, -0.25],
    cameraPosition: [0.35, 1.4, 0.8],
    position: [1.15, 0.1, -0.25],
    placeholderSize: [0.06, 0.12, 0.06],
    color: "#888888",
    modelUrl: "/models/protien_shaker.glb",
    scale: [0.1, 0.1, 0.1],
    rotation: [0, 0, 0],
    modal: "fitness",
  },
  chessboard: {
    label: "CHESS BOARD",
    cameraTarget: [-1.5, 0.2, -0.2],
    cameraPosition: [-0.35, 1.4, 0.8],
    position: [-1.5, 0.2, -0.2],
    placeholderSize: [0.15, 0.05, 0.15],
    color: "#222222",
    modelUrl: "/models/chess_borad.glb",
    scale: [3, 3, 3],
    rotation: [0, Math.PI/4, 0],
    modal: "chess",
  },
  phone: {
    label: "PHONE",
    cameraTarget: [0.55, 0.8, 0.2],
    cameraPosition: [0.55, 1.4, 0.8],
    position: [0.55, 0.8, 0.2],
    placeholderSize: [0.08, 0.01, 0.15],
    color: "#1a1a2e",
    modelUrl: "/models/phone.glb",
    scale: [300, 300, 300],
    rotation: [0, 0, 0],
    modal: "socials",
  },
};

/** Default camera position (seated at desk) */
export const DEFAULT_CAMERA_POSITION: [number, number, number] = [0, 1.4, 2.0];
export const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 0.9, 0];

/** Animation durations in seconds */
export const DURATIONS = {
  CAMERA_FOCUS: 1.2,
  CAMERA_RETURN: 1.0,
  HOVER_DEBOUNCE_MS: 120,
} as const;

/** Asset paths */
export const ASSETS = {
  DESK_MODEL: "/models/computer_desk.glb",
  RESUME_PDF: "/Adam-Porbanderwalla-Resume.pdf",
} as const;
