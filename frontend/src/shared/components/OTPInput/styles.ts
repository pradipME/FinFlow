/**
 * OTPInput — Styles
 *
 * Pure functions composing className from props.
 */
import type { OTPSize } from "./types";
import {
  WRAPPER_CLASSES,
  CELLS_CONTAINER_CLASSES,
  CELL_SIZE_CLASSES,
  CELL_BASE_CLASSES,
  CELL_ERROR_CLASSES,
  CELL_FILLED_CLASSES,
  HIDDEN_INPUT_CLASSES,
  LABEL_CLASSES,
} from "./constants";

export function getWrapperClasses(customClassName?: string): string {
  return [WRAPPER_CLASSES, customClassName ?? ""].filter(Boolean).join(" ");
}

export function getCellsContainerClasses(): string {
  return CELLS_CONTAINER_CLASSES;
}

export function getCellClasses(
  size: OTPSize,
  isFilled: boolean,
  isError: boolean,
  isActive: boolean,
): string {
  const classes = [
    CELL_BASE_CLASSES,
    CELL_SIZE_CLASSES[size],
    isFilled ? CELL_FILLED_CLASSES : "",
    isError ? CELL_ERROR_CLASSES : "",
    isActive ? "border-brand-primary ring-2 ring-brand-primary/20" : "",
  ];
  return classes.filter(Boolean).join(" ");
}

export function getHiddenInputClasses(): string {
  return HIDDEN_INPUT_CLASSES;
}

export function getLabelClasses(): string {
  return LABEL_CLASSES;
}
