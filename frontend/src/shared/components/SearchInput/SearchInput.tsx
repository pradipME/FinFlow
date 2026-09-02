/**
 * SearchInput
 *
 * Enterprise search field that composes <Input> and adds:
 *   - Built-in magnifying glass icon (non-optional)
 *   - Always-clearable when value is present
 *   - Keyboard shortcut hint badge
 *   - onSearch callback (Enter key / clear)
 *   - debounce-ready API surface
 *
 * Zero duplicated input logic — all delegated to Input.
 *
 * @example
 *   <SearchInput placeholder="Search transactions…" onSearch={handleSearch} />
 *   <SearchInput searchShortcut="⌘K" onSearch={handleSearch} debounceMs={300} />
 *   <SearchInput label="Find user" autoFocus />
 */
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
} from "react";
import { MotionConfig } from "framer-motion";
import { Input } from "../Input/Input";
import type { SearchInputProps } from "./types";
import { getWrapperClasses, getShortcutBadgeClasses } from "./styles";

// ── Magnifying Glass Icon ────────────────────────────────────────

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

// ── SearchInput ──────────────────────────────────────────────────

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      onSearch,
      searchShortcut,
      debounceMs = 300,
      autoFocus = false,
      placeholder = "Search\u2026",
      disabled = false,
      readOnly = false,
      loading = false,
      onKeyDown,
      onChange,
      className,
      ...rest
    },
    ref,
  ) {
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Handlers ──────────────────────────────────────────────

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          const query = (e.target as HTMLInputElement).value;
          onSearch?.(query);
        }
        onKeyDown?.(e);
      },
      [onSearch, onKeyDown],
    );

    const handleClear = useCallback(() => {
      onSearch?.("");
    }, [onSearch]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
        if (!onSearch) return;
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        const value = e.target.value;
        debounceTimer.current = setTimeout(() => onSearch(value), debounceMs);
      },
      [onSearch, onChange, debounceMs],
    );

    useEffect(() => {
      return () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
      };
    }, []);

    // ── Render ────────────────────────────────────────────────

    const hasShortcut = !!searchShortcut;

    return (
      <MotionConfig reducedMotion="user">
        <div className={getWrapperClasses(className)}>
          <Input
            ref={ref}
            {...rest}
            type="search"
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            loading={loading}
            autoFocus={autoFocus}
            clearable
            onClear={handleClear}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            aria-label={rest["aria-label"] ?? "Search"}
            leftIcon={<SearchIcon />}
            suffix={
              hasShortcut ? (
                <kbd className={getShortcutBadgeClasses()}>
                  {searchShortcut}
                </kbd>
              ) : undefined
            }
          />
        </div>
      </MotionConfig>
    );
  },
);
