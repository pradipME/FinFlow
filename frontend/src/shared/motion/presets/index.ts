/**
 * Motion Presets — Barrel Export
 *
 * All animation presets in one import.
 * Components: import { fade, slideUp, modalContent } from "@/shared/motion/presets";
 */

// Fade
export { fade, fadeSlow, fadeFast, fadeUp, fadeDown } from "./fade";

// Slide
export {
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  slideUpPure,
  slideDownPure,
  slideLeftPure,
  slideRightPure,
} from "./slide";

// Scale
export { scaleIn, scaleCenter, scaleSpring, scalePop, scaleExpand } from "./scale";

// Hover / Press
export {
  hoverLift,
  hoverScale,
  hoverGlow,
  hoverBright,
  pressScale,
  pressDeep,
  pressSpring,
  buttonInteraction,
  cardInteraction,
  iconButtonInteraction,
} from "./hover";

// Modal
export { modalBackdrop, modalContent, modalContentSpring, alertDialog } from "./modal";

// Drawer
export {
  drawerBackdrop,
  drawerRight,
  drawerLeft,
  drawerTop,
  drawerBottom,
} from "./drawer";

// Page
export { pageFade, pageSlide, pageSlideLeft, pageSlideRight, pageZoom } from "./page";

// Toast
export { toastEnter, toastExit, toastStack, toastSuccess } from "./toast";

// Skeleton
export { skeletonPulse, skeletonShimmer, skeletonFadeIn } from "./skeleton";
