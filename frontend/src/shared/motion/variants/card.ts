/**
 * Motion Variants — Card
 *
 * Complete variant map for card components.
 * Includes hover lift, press, and stagger-ready children.
 *
 * Usage:
 *   <motion.div variants={cardVariants} initial="rest" whileHover="hover" />
 */
import type { Variants } from "framer-motion";
import { duration, easing } from "../tokens";

export const cardVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: "var(--ff-elevation-xs)",
  },
  hover: {
    y: -2,
    scale: 1.005,
    boxShadow: "var(--ff-elevation-md)",
    transition: { duration: duration.fast / 1000, ease: easing.out },
  },
  press: {
    y: 0,
    scale: 0.995,
    boxShadow: "var(--ff-elevation-xs)",
    transition: { duration: duration.fastest / 1000, ease: easing.sharp },
  },
};

/** Card with stronger lift — for featured / stat cards */
export const cardFeaturedVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: "var(--ff-elevation-sm)",
  },
  hover: {
    y: -4,
    scale: 1.01,
    boxShadow: "var(--ff-elevation-lg)",
    transition: { duration: duration.normal / 1000, ease: easing.out },
  },
  press: {
    y: -1,
    scale: 0.998,
    boxShadow: "var(--ff-elevation-sm)",
    transition: { duration: duration.fastest / 1000, ease: easing.sharp },
  },
};

/** Card children container — for stagger reveal */
export const cardChildrenVariants: Variants = {
  rest: {},
  hover: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

/** Individual child of a staggered card */
export const cardChildItem: Variants = {
  rest: { opacity: 1, y: 0 },
  hover: {
    opacity: 1,
    y: -1,
    transition: { duration: duration.faster / 1000, ease: easing.out },
  },
};

/** Interactive card — for clickable list items */
export const listItemVariants: Variants = {
  rest: {
    backgroundColor: "transparent",
    x: 0,
  },
  hover: {
    backgroundColor: "var(--ff-surface-hover)",
    x: 2,
    transition: { duration: duration.faster / 1000, ease: easing.out },
  },
  press: {
    backgroundColor: "var(--ff-surface-active)",
    x: 0,
    transition: { duration: duration.fastest / 1000, ease: easing.sharp },
  },
};
