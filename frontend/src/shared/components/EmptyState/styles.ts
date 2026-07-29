import { cn } from "@/shared/utils";
import {
  WRAPPER_CLASSES,
  ICON_CLASSES,
  TITLE_CLASSES,
  DESCRIPTION_CLASSES,
  ACTIONS_CLASSES,
} from "./constants";

export function getEmptyStateClasses(className?: string): string {
  return cn(WRAPPER_CLASSES, className);
}

export function getEmptyStateIconClasses(): string {
  return ICON_CLASSES;
}

export function getEmptyStateTitleClasses(): string {
  return TITLE_CLASSES;
}

export function getEmptyStateDescriptionClasses(): string {
  return DESCRIPTION_CLASSES;
}

export function getEmptyStateActionsClasses(): string {
  return ACTIONS_CLASSES;
}
