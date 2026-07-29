import "@testing-library/jest-dom/vitest";

// Mock window.matchMedia for jsdom (used by useReducedMotion, useBreakpoint, etc.)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
