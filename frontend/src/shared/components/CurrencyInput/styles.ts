/**
 * CurrencyInput — Styles
 *
 * Pure functions composing className from props.
 */
import { WRAPPER_CLASSES } from "./constants";

export function getWrapperClasses(customClassName?: string): string {
  return [WRAPPER_CLASSES, customClassName ?? ""].filter(Boolean).join(" ");
}
