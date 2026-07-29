import type { LoadingOverlayMode } from "./types";

export const DEFAULT_MODE: LoadingOverlayMode = "overlay";
export const DEFAULT_LABEL = "Loading";
export const DEFAULT_OPACITY = 0.6;

export const MODE_CLASSES: Record<LoadingOverlayMode, string> = {
  overlay: "absolute inset-0",
  fullscreen: "fixed inset-0",
};

export const BACKDROP_CLASSES =
  "bg-bg-primary/60 backdrop-blur-sm";

export const CONTENT_CLASSES =
  "flex flex-col items-center justify-center gap-3 z-10";

export const SPINNER_SIZE = 32;
