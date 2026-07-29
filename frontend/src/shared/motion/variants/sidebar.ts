/**
 * Motion Variants — Sidebar
 *
 * Sidebar expand/collapse, content fade, icon rotation, stagger menu items.
 *
 * Usage:
 *   <motion.aside variants={sidebarVariants} animate={isOpen ? "expanded" : "collapsed"} />
 */
import type { Variants } from "framer-motion";
import { duration, easing } from "../tokens";

/** Sidebar container — width transition */
export const sidebarVariants: Variants = {
  collapsed: {
    width: 72,
    transition: { duration: duration.moderate / 1000, ease: easing.out },
  },
  expanded: {
    width: 260,
    transition: {
      duration: duration.moderate / 1000,
      ease: easing.out,
      staggerChildren: 0.04,
      delayChildren: 0.08,
    },
  },
};

/** Sidebar label text — fade in/out */
export const sidebarLabelVariants: Variants = {
  collapsed: {
    opacity: 0,
    width: 0,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
  expanded: {
    opacity: 1,
    width: "auto",
    transition: { duration: duration.normal / 1000, ease: easing.out },
  },
};

/** Sidebar menu item */
export const sidebarItemVariants: Variants = {
  collapsed: {
    opacity: 0,
    x: -8,
  },
  expanded: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.normal / 1000, ease: easing.out },
  },
};

/** Sidebar icon rotation — for expand/collapse chevron */
export const sidebarIconVariants: Variants = {
  collapsed: { rotate: 0 },
  expanded: { rotate: 180 },
};

/** Sidebar overlay (mobile) — fade in */
export const sidebarOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.normal / 1000, ease: easing.out },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.fast / 1000, ease: easing.in },
  },
};

/** Sidebar mobile slide — from left */
export const sidebarMobileVariants: Variants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: { duration: duration.moderate / 1000, ease: easing.out },
  },
  exit: {
    x: "-100%",
    transition: { duration: duration.moderate / 1000, ease: easing.in },
  },
};
