/**
 * PasswordInput — Styles
 *
 * Pure functions composing className from props.
 * Minimal — most styling is delegated to Input.
 */
import {
  TOGGLE_BUTTON_CLASSES,
  CAPS_LOCK_BANNER_CLASSES,
  STRENGTH_INDICATOR_CLASSES,
} from "./constants";

export function getToggleButtonClasses(): string {
  return TOGGLE_BUTTON_CLASSES;
}

export function getCapsLockBannerClasses(): string {
  return CAPS_LOCK_BANNER_CLASSES;
}

export function getStrengthIndicatorClasses(): string {
  return STRENGTH_INDICATOR_CLASSES;
}
