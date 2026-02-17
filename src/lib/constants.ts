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

/** Object metadata: labels and camera target positions */
export const DESK_OBJECTS: Record<
  DeskObjectId,
  { label: string; cameraTarget: [number, number, number]; cameraPosition: [number, number, number] }
> = {
  monitor: {
    label: "MONITOR",
    cameraTarget: [0, 1.2, -0.5],
    cameraPosition: [0, 1.2, 0.3],
  },
  keyboard: {
    label: "KEYBOARD",
    cameraTarget: [0, 0.8, 0],
    cameraPosition: [0, 1.5, 0.8],
  },
  notebook: {
    label: "NOTEBOOK",
    cameraTarget: [-0.6, 0.8, -0.2],
    cameraPosition: [-0.6, 1.4, 0.6],
  },
  papers: {
    label: "PAPERS",
    cameraTarget: [0.6, 0.8, -0.2],
    cameraPosition: [0.6, 1.4, 0.6],
  },
  drawer: {
    label: "DRAWER",
    cameraTarget: [0, 0.3, 0],
    cameraPosition: [0, 0.8, 0.8],
  },
  dumbbell: {
    label: "DUMBBELL",
    cameraTarget: [-0.3, 0.3, 0],
    cameraPosition: [-0.3, 0.8, 0.8],
  },
  "chess-knight": {
    label: "CHESS KNIGHT",
    cameraTarget: [0.3, 0.3, 0],
    cameraPosition: [0.3, 0.8, 0.8],
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
