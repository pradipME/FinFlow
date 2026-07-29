import { cn } from "@/shared/utils";
import {
  WRAPPER_CLASSES,
  ICON_CLASSES,
  TITLE_CLASSES,
  DESCRIPTION_CLASSES,
  ERROR_CODE_CLASSES,
  ACTIONS_CLASSES,
} from "./constants";

export function getErrorStateClasses(className?: string): string {
  return cn(WRAPPER_CLASSES, className);
}

export function getErrorStateIconClasses(): string {
  return ICON_CLASSES;
}

export function getErrorStateTitleClasses(): string {
  return TITLE_CLASSES;
}

export function getErrorStateDescriptionClasses(): string {
  return DESCRIPTION_CLASSES;
}

export function getErrorCodeClasses(): string {
  return ERROR_CODE_CLASSES;
}

export function getErrorStateActionsClasses(): string {
  return ACTIONS_CLASSES;
}
