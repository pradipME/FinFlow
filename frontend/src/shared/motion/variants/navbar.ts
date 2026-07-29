/**
 * Motion Variants — Navbar
 *
 * Scroll-based opacity/shadow, mobile menu toggle.
 *
 * Usage:
 *   <motion.header variants={navbarVariants} animate={scrolled ? "scrolled" : "top"} />
 */
import type { Variants } from "framer-motion";
import { duration, easing } from "../tokens";

/** Navbar — top vs scrolled state */
export const navbarVariants: Variants = {
  top: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    boxShadow: "0 0 0 rgba(0,0,0,0)",
    borderBottom: "1px solid transparent",
  },
  scrolled: {
    backgroundColor: "var(--ff-surface-primary)",
    boxShadow: "var(--ff-elevation-sm)",
    borderBottom: "1px solid var(--ff-border-default)",
    transition: { duration: duration.normal / 1000, ease: easing.out },
  },
};

/** Navbar dark-mode variant */
export const navbarDarkVariants: Variants = {
  top: {
    backgroundColor: "rgba(10, 10, 11, 0)",
    boxShadow: "0 0 0 rgba(0,0,0,0)",
    borderBottom: "1px solid transparent",
  },
  scrolled: {
    backgroundColor: "var(--ff-surface-primary)",
    boxShadow: "var(--ff-elevation-sm)",
    borderBottom: "1px solid var(--ff-border-default)",
    transition: { duration: duration.normal / 1000, ease: easing.out },
  },
};

/** Mobile menu toggle — hamburger to X */
export const menuToggleVariants: Variants = {
  closed: {
    rotate: 0,
    transition: { duration: duration.fast / 1000, ease: easing.out },
  },
  open: {
    rotate: 90,
    transition: { duration: duration.fast / 1000, ease: easing.out },
  },
};

/** Mobile nav menu — slide down */
export const mobileNavVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    overflow: "hidden",
  },
  visible: {
    opacity: 1,
    height: "auto",
    overflow: "hidden",
    transition: {
      height: { duration: duration.moderate / 1000, ease: easing.out },
      opacity: { duration: duration.normal / 1000, ease: easing.out },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: "hidden",
    transition: {
      opacity: { duration: duration.fast / 1000, ease: easing.in },
      height: { duration: duration.moderate / 1000, ease: easing.in },
    },
  },
};

/** Nav item hover underline */
export const navItemVariants: Variants = {
  rest: { scaleX: 0, originX: 0 },
  hover: {
    scaleX: 1,
    transition: { duration: duration.fast / 1000, ease: easing.out },
  },
};
