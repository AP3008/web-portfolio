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
  | "phone"
  | "protein_powder"
  | "desk_lamp"
  | "desk_plant"
  | "pen_holder"
  | "computer_mouse";

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
  /** Display name shown in HoverHUD (e.g. "Terminal" instead of "MONITOR") */
  hudLabel?: string;
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
  /** Whether this object is interactive (hover/click). Defaults to true. */
  interactive?: boolean;
  /** Another object ID that should co-highlight on hover */
  linkedHoverId?: DeskObjectId;
}

export const DESK_OBJECTS: Record<DeskObjectId, DeskObjectConfig> = {
  monitor: {
    label: "MONITOR",
    hudLabel: "Terminal",
    cameraTarget: [0, 1.2, -0.5],
    cameraPosition: [0, 1.2, 0.3],
    position: [0, 0.355, -1.0],
    placeholderSize: [0.6, 0.4, 0.05],
    color: "#333333",
    modelUrl: "/models/monitor.glb",
    scale: [0.003, 0.003, 0.003],
    rotation: [0, -Math.PI / 2, 0],
    modal: null,
  },
  keyboard: {
    label: "KEYBOARD",
    hudLabel: "Projects",
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
    hudLabel: "About Me",
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
    hudLabel: "Resume",
    cameraTarget: [0.5, 0.8, -0.1],
    cameraPosition: [0.5, 1.4, 0.6],
    position: [1.0, 0.5, 0.55],
    placeholderSize: [0.21, 0.02, 0.29],
    color: "#eeeeee",
    modelUrl: "/models/papers.glb",
    scale: [1, 1, 1],
    rotation: [0, -Math.PI / 4, 0],
    modal: "resume",
  },
  shaker: {
    label: "PROTEIN SHAKER",
    hudLabel: "Body Building",
    cameraTarget: [1.275, 0.1, -0.5],
    cameraPosition: [0.35, 1.4, 0.8],
    position: [1.275, 0.1, -0.5],
    placeholderSize: [0.06, 0.12, 0.06],
    color: "#888888",
    modelUrl: "/models/protien_shaker.glb",
    scale: [0.15, 0.15, 0.15],
    rotation: [0, -Math.PI / 4, 0],
    modal: "fitness",
    linkedHoverId: "protein_powder",
  },
  chessboard: {
    label: "CHESS BOARD",
    hudLabel: "Chess Board",
    cameraTarget: [-1.75, 0.2, -0.5],
    cameraPosition: [-0.35, 1.4, 0.8],
    position: [-1.75, 0.2, -0.5],
    placeholderSize: [0.15, 0.05, 0.15],
    color: "#222222",
    modelUrl: "/models/chess_borad.glb",
    scale: [3.5, 3.5, 3.5],
    rotation: [0, Math.PI / 4, 0],
    modal: "chess",
  },
  phone: {
    label: "PHONE",
    hudLabel: "Socials",
    cameraTarget: [0.55, 0.8, 0.2],
    cameraPosition: [0.55, 1.4, 0.8],
    position: [0.55, 0.8, 0.2],
    placeholderSize: [0.08, 0.01, 0.15],
    color: "#1a1a2e",
    modelUrl: "/models/phone.glb",
    scale: [3, 3, 3],
    rotation: [0, 0, 0],
    modal: "socials",
  },
  protein_powder: {
    label: "PROTEIN POWDER",
    hudLabel: "Body Building",
    cameraTarget: [1.275, 0.1, -0.5],
    cameraPosition: [0.35, 1.4, 0.8],
    position: [1.5, 0.1, -0.3],
    placeholderSize: [0.1, 0.15, 0.1],
    color: "#aa4444",
    modelUrl: "/models/protein_powder.glb",
    scale: [0.15, 0.15, 0.15],
    rotation: [0, 0, 0],
    modal: "fitness",
    linkedHoverId: "shaker",
  },
  desk_lamp: {
    label: "DESK LAMP",
    cameraTarget: [0, 0, 0],
    cameraPosition: [0, 0, 0],
    position: [-1.2, 0.75, -0.6],
    placeholderSize: [0.1, 0.2, 0.1],
    color: "#444444",
    modelUrl: "/models/desk_lamp.glb",
    scale: [0.3, 0.3, 0.3],
    rotation: [0, 0, 0],
    modal: null,
    interactive: false,
  },
  desk_plant: {
    label: "DESK PLANT",
    cameraTarget: [0, 0, 0],
    cameraPosition: [0, 0, 0],
    position: [1.4, 0.75, -0.6],
    placeholderSize: [0.12, 0.15, 0.12],
    color: "#228833",
    modelUrl: "/models/desk_plant.glb",
    scale: [0.3, 0.3, 0.3],
    rotation: [0, 0, 0],
    modal: null,
    interactive: false,
  },
  pen_holder: {
    label: "PEN HOLDER",
    cameraTarget: [0, 0, 0],
    cameraPosition: [0, 0, 0],
    position: [-0.8, 0.75, 0.1],
    placeholderSize: [0.06, 0.1, 0.06],
    color: "#555555",
    modelUrl: "/models/pen_holder.glb",
    scale: [0.3, 0.3, 0.3],
    rotation: [0, 0, 0],
    modal: null,
    interactive: false,
  },
  computer_mouse: {
    label: "COMPUTER MOUSE",
    cameraTarget: [0, 0, 0],
    cameraPosition: [0, 0, 0],
    position: [0.4, 0.75, 0.1],
    placeholderSize: [0.05, 0.02, 0.08],
    color: "#333333",
    modelUrl: "/models/computer_mouse_low-poly.glb",
    scale: [0.3, 0.3, 0.3],
    rotation: [0, 0, 0],
    modal: null,
    interactive: false,
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
