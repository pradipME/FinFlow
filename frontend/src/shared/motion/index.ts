/**
 * Motion Engine — Public API
 *
 * Single import path for all motion functionality.
 *
 * Usage:
 *   import { useReducedMotion, fade, slideUp, MotionProvider } from "@/shared/motion";
 */

// Provider (mount once in main.tsx)
export { MotionProvider, useMotionContext } from "./provider/MotionProvider";

// Hooks
export { useReducedMotion } from "./hooks/useReducedMotion";

// Tokens (for building custom animations)
export { duration, easing, spring, scale, opacity, blur, distance, rotation } from "./tokens";

// Types
export type {
  DurationToken,
  EasingName,
  SpringName,
  SpringPreset,
  Variants,
  VariantState,
  MotionTransition,
  MotionPreset,
  PresetVariants,
} from "./types";

// Constants
export { REDUCED_MOTION_MEDIA, REDUCED_MOTION_STORAGE_KEY, DURATION_NAMES, EASING_NAMES, SPRING_NAMES } from "./constants";

// Presets — re-export all from presets barrel
export {
  // Fade
  fade,
  fadeSlow,
  fadeFast,
  fadeUp,
  fadeDown,
  // Slide
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  slideUpPure,
  slideDownPure,
  slideLeftPure,
  slideRightPure,
  // Scale
  scaleIn,
  scaleCenter,
  scaleSpring,
  scalePop,
  scaleExpand,
  // Hover / Press
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
  // Modal
  modalBackdrop,
  modalContent,
  modalContentSpring,
  alertDialog,
  // Drawer
  drawerBackdrop,
  drawerRight,
  drawerLeft,
  drawerTop,
  drawerBottom,
  // Page
  pageFade,
  pageSlide,
  pageSlideLeft,
  pageSlideRight,
  pageZoom,
  // Toast
  toastEnter,
  toastExit,
  toastStack,
  toastSuccess,
  // Skeleton
  skeletonPulse,
  skeletonShimmer,
  skeletonFadeIn,
} from "./presets";

// Variants — re-export all from variants barrel
export {
  buttonVariants,
  ghostButtonVariants,
  iconButtonVariants,
  buttonSpinnerVariants,
  cardVariants,
  cardFeaturedVariants,
  cardChildrenVariants,
  cardChildItem,
  listItemVariants,
  dialogVariants,
  dialogPanelVariants,
  confirmDialogVariants,
  dialogBackdropVariants,
  dialogStagger,
  dialogChildItem,
  sidebarVariants,
  sidebarLabelVariants,
  sidebarItemVariants,
  sidebarIconVariants,
  sidebarOverlayVariants,
  sidebarMobileVariants,
  navbarVariants,
  navbarDarkVariants,
  menuToggleVariants,
  mobileNavVariants,
  navItemVariants,
} from "./variants";

// Utilities
export {
  staggerConfig,
  childDelay,
  withReducedMotion,
  buildFadeVariant,
  buildSlideVariant,
  mergeVariants,
} from "./utils/animation";
