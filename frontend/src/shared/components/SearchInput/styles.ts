/**
 * SearchInput — Styles
 *
 * Pure functions composing className from props.
 */
import { WRAPPER_CLASSES, SHORTCUT_BADGE_CLASSES, CLEAR_BUTTON_CLASSES } from "./constants";

export function getWrapperClasses(customClassName?: string): string {
  return [WRAPPER_CLASSES, customClassName ?? ""].filter(Boolean).join(" ");
}

export function getShortcutBadgeClasses(): string {
  return SHORTCUT_BADGE_CLASSES;
}

export function getClearButtonClasses(): string {
  return CLEAR_BUTTON_CLASSES;
}
