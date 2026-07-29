/**
 * SearchInput — Type Definitions
 *
 * Enterprise search field that composes <Input> and adds:
 *   - Built-in magnifying glass icon
 *   - Always-clearable behavior
 *   - Keyboard shortcut hint badge
 *   - onSearch callback (Enter / clear)
 *   - debounce-ready API surface
 *
 * Zero duplicated input logic — all delegated to Input.
 */
import type { ReactNode } from "react";
import type { InputProps } from "../Input/types";

// ── Props ────────────────────────────────────────────────────────

export interface SearchInputProps extends Omit<InputProps, "type" | "leftIcon" | "clearable"> {
  /**
   * Callback fired when the user presses Enter or clears the field.
   * @param query — current input value
   */
  onSearch?: (query: string) => void;

  /**
   * Keyboard shortcut hint displayed as a badge (e.g. "⌘K", "Ctrl+K").
   * Rendered visually — no binding is created by the component itself.
   */
  searchShortcut?: string;

  /**
   * Hint for the consumer that this field is debounce-ready.
   * Purely informational — the component does NOT debounce internally.
   * Consumer is expected to debounce in their onSearch handler or
   * wrap with a debounce utility.
   * @default undefined
   */
  debounceMs?: number;

  /**
   * Auto-focus the input on mount.
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Placeholder text.
   * @default "Search…"
   */
  placeholder?: string;

  /**
   * Optional icon rendered before the search icon.
   */
  leftIcon?: ReactNode;
}
