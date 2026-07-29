/**
 * Input — Styles
 *
 * Pure functions composing className from props.
 * Single source of truth for class merging.
 */
import type { InputSize, InputState } from "./types";
import {
  INPUT_WRAPPER_CLASSES,
  INPUT_SIZE_CLASSES,
  INPUT_STATE_CLASSES,
  DISABLED_CLASSES,
  READONLY_CLASSES,
  INPUT_ELEMENT_CLASSES,
  LEFT_ICON_CLASSES,
  RIGHT_ICON_CLASSES,
  PREFIX_CLASSES,
  SUFFIX_CLASSES,
  CLEAR_BUTTON_CLASSES,
  LOADING_SPINNER_CLASSES,
  PADDING_LEFT_WITH_ICON,
  PADDING_LEFT_WITH_PREFIX,
  PADDING_RIGHT_WITH_ICON,
  PADDING_RIGHT_WITH_CLEAR,
  PADDING_RIGHT_WITH_LOADING,
} from "./constants";

interface GetWrapperClassesOptions {
  size: InputSize;
  state: InputState;
  disabled: boolean;
  readOnly: boolean;
  hasLeftIcon: boolean;
  hasRightIcon: boolean;
  hasPrefix: boolean;
  hasSuffix: boolean;
  hasClear: boolean;
  hasLoading: boolean;
}

export function getInputWrapperClasses({
  size,
  state,
  disabled,
  readOnly,
  hasLeftIcon,
  hasRightIcon,
  hasPrefix,
  hasSuffix,
  hasClear,
  hasLoading,
}: GetWrapperClassesOptions): string {
  const classes = [
    INPUT_WRAPPER_CLASSES,
    INPUT_SIZE_CLASSES[size],
    disabled ? DISABLED_CLASSES : readOnly ? READONLY_CLASSES : INPUT_STATE_CLASSES[state],
    hasLeftIcon ? PADDING_LEFT_WITH_ICON : "",
    hasPrefix ? PADDING_LEFT_WITH_PREFIX : "",
    hasRightIcon ? PADDING_RIGHT_WITH_ICON : "",
    hasClear ? PADDING_RIGHT_WITH_CLEAR : "",
    hasLoading ? PADDING_RIGHT_WITH_LOADING : "",
    hasSuffix ? "" : "",
  ];
  return classes.filter(Boolean).join(" ");
}

export function getInputElementClasses(): string {
  return INPUT_ELEMENT_CLASSES;
}

export function getLeftIconClasses(): string {
  return LEFT_ICON_CLASSES;
}

export function getRightIconClasses(): string {
  return RIGHT_ICON_CLASSES;
}

export function getPrefixClasses(): string {
  return PREFIX_CLASSES;
}

export function getSuffixClasses(): string {
  return SUFFIX_CLASSES;
}

export function getClearButtonClasses(): string {
  return CLEAR_BUTTON_CLASSES;
}

export function getLoadingSpinnerClasses(): string {
  return LOADING_SPINNER_CLASSES;
}
