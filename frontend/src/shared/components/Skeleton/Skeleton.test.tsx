import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

// ── Mock: useReducedMotion ───────────────────────────────────────
let mockReduced = false;

vi.mock("@/shared/motion", () => ({
  useReducedMotion: () => mockReduced,
  skeletonPulse: {
    animate: { opacity: [0.4, 0.7, 0.4] },
    transition: {
      duration: 1.5,
      ease: [0.4, 0, 0.2, 1],
      repeat: Infinity,
      repeatType: "loop",
    },
  },
  skeletonShimmer: {
    animate: { backgroundPosition: ["200% 0", "-200% 0"] },
    transition: {
      duration: 1.8,
      ease: [0.4, 0, 0.2, 1],
      repeat: Infinity,
      repeatType: "loop",
    },
  },
  duration: { normal: 400, slow: 500, slowest: 800 },
  easing: { out: [0, 0, 0.2, 1], "in-out": [0.4, 0, 0.2, 1] },
}));

beforeEach(() => {
  mockReduced = false;
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── Helpers ──────────────────────────────────────────────────────

/** Get the inner skeleton block (first child of wrapper, which is role=presentation) */
function getBlock(container: HTMLElement): HTMLElement {
  return container.firstElementChild!.firstElementChild! as HTMLElement;
}

/** Get the inner layout container (for multi-line variants like card, tableRow) */
function getInner(container: HTMLElement): HTMLElement {
  return container.firstElementChild!.firstElementChild! as HTMLElement;
}

// ── Rendering ────────────────────────────────────────────────────

describe("Skeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it("renders with role=presentation on wrapper", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild).toHaveAttribute("role", "presentation");
  });

  it("applies custom className", () => {
    const { container } = render(<Skeleton className="my-class" />);
    expect(container.firstElementChild!.className).toContain("my-class");
  });

  // ── Accessibility ────────────────────────────────────────────

  describe("accessibility", () => {
    it("all blocks have aria-hidden=true", () => {
      const { container } = render(<Skeleton variant="card" />);
      const hidden = container.querySelectorAll("[aria-hidden='true']");
      expect(hidden.length).toBeGreaterThan(0);
    });

    it("wrapper has role=presentation", () => {
      const { container } = render(<Skeleton />);
      expect(container.firstElementChild).toHaveAttribute("role", "presentation");
    });

    it("custom variant has aria-hidden on inner block", () => {
      const { container } = render(<Skeleton variant="custom" />);
      const hidden = container.querySelectorAll("[aria-hidden='true']");
      expect(hidden.length).toBe(1);
    });
  });

  // ── Variants ─────────────────────────────────────────────────

  describe("text", () => {
    it("renders a single block", () => {
      const { container } = render(<Skeleton variant="text" />);
      const block = getBlock(container);
      expect(block).toBeTruthy();
      expect(block.getAttribute("aria-hidden")).toBe("true");
    });

    it("applies base classes", () => {
      const { container } = render(<Skeleton variant="text" />);
      const block = getBlock(container);
      expect(block.className).toContain("relative");
      expect(block.className).toContain("overflow-hidden");
    });
  });

  describe("avatar", () => {
    it("renders a circle block", () => {
      const { container } = render(<Skeleton variant="avatar" />);
      const block = getBlock(container);
      expect(block.getAttribute("aria-hidden")).toBe("true");
    });

    it("forces circle shape regardless of circle prop", () => {
      const { container } = render(<Skeleton variant="avatar" />);
      const block = getBlock(container);
      expect(block.style.borderRadius).toBe("50%");
    });
  });

  describe("card", () => {
    it("renders multiple inner blocks", () => {
      const { container } = render(<Skeleton variant="card" />);
      const inner = getInner(container);
      // 1 header + 3 content lines = 4 blocks
      const blocks = inner.querySelectorAll("[aria-hidden='true']");
      expect(blocks.length).toBe(4);
    });

    it("has flex-col layout with gap", () => {
      const { container } = render(<Skeleton variant="card" />);
      const inner = getInner(container);
      expect(inner.className).toContain("flex-col");
    });
  });

  describe("tableRow", () => {
    it("renders multiple cell blocks", () => {
      const { container } = render(<Skeleton variant="tableRow" />);
      const inner = getInner(container);
      const blocks = inner.querySelectorAll("[aria-hidden='true']");
      expect(blocks.length).toBe(4);
    });

    it("has flex layout", () => {
      const { container } = render(<Skeleton variant="tableRow" />);
      const inner = getInner(container);
      expect(inner.className).toContain("flex");
    });
  });

  describe("chart", () => {
    it("renders a single block", () => {
      const { container } = render(<Skeleton variant="chart" />);
      const block = getBlock(container);
      expect(block).toBeTruthy();
      expect(block.getAttribute("aria-hidden")).toBe("true");
    });

    it("default height is 200px", () => {
      const { container } = render(<Skeleton variant="chart" />);
      const block = getBlock(container);
      expect(block.style.height).toBe("200px");
    });
  });

  describe("listItem", () => {
    it("renders avatar + text lines", () => {
      const { container } = render(<Skeleton variant="listItem" />);
      const inner = getInner(container);
      const blocks = inner.querySelectorAll("[aria-hidden='true']");
      // 1 avatar circle + 2 text lines = 3
      expect(blocks.length).toBe(3);
    });

    it("has flex layout with gap", () => {
      const { container } = render(<Skeleton variant="listItem" />);
      const inner = getInner(container);
      expect(inner.className).toContain("flex");
    });
  });

  describe("dashboardWidget", () => {
    it("renders title bar + content + footer lines", () => {
      const { container } = render(<Skeleton variant="dashboardWidget" />);
      const inner = getInner(container);
      const blocks = inner.querySelectorAll("[aria-hidden='true']");
      // 1 title + 1 content + 2 footer = 4
      expect(blocks.length).toBe(4);
    });

    it("has flex-col layout with gap", () => {
      const { container } = render(<Skeleton variant="dashboardWidget" />);
      const inner = getInner(container);
      expect(inner.className).toContain("flex-col");
    });
  });

  describe("custom", () => {
    it("renders a single block with user dimensions", () => {
      const { container } = render(<Skeleton variant="custom" width="300px" height="100px" />);
      const block = getBlock(container);
      expect(block.style.width).toBe("300px");
      expect(block.style.height).toBe("100px");
    });

    it("supports pixel number dimensions", () => {
      const { container } = render(<Skeleton variant="custom" width={300} height={100} />);
      const block = getBlock(container);
      expect(block.style.width).toBe("300px");
      expect(block.style.height).toBe("100px");
    });

    it("supports circle prop", () => {
      const { container } = render(<Skeleton variant="custom" circle />);
      const block = getBlock(container);
      expect(block.style.borderRadius).toBe("50%");
    });

    it("supports custom rounded", () => {
      const { container } = render(<Skeleton variant="custom" rounded="16px" />);
      const block = getBlock(container);
      expect(block.style.borderRadius).toBe("16px");
    });

    it("supports numeric rounded", () => {
      const { container } = render(<Skeleton variant="custom" rounded={12} />);
      const block = getBlock(container);
      expect(block.style.borderRadius).toBe("12px");
    });
  });

  // ── Width / Height ───────────────────────────────────────────

  describe("dimensions", () => {
    it("accepts string width", () => {
      const { container } = render(<Skeleton variant="text" width="50%" />);
      const block = getBlock(container);
      expect(block.style.width).toBe("50%");
    });

    it("accepts number width (converts to px)", () => {
      const { container } = render(<Skeleton variant="text" width={200} />);
      const block = getBlock(container);
      expect(block.style.width).toBe("200px");
    });

    it("accepts string height", () => {
      const { container } = render(<Skeleton variant="text" height="20px" />);
      const block = getBlock(container);
      expect(block.style.height).toBe("20px");
    });

    it("accepts number height (converts to px)", () => {
      const { container } = render(<Skeleton variant="chart" height={300} />);
      const block = getBlock(container);
      expect(block.style.height).toBe("300px");
    });
  });

  // ── Rounded ──────────────────────────────────────────────────

  describe("rounded", () => {
    it("applies string border-radius", () => {
      const { container } = render(<Skeleton variant="custom" rounded="16px" />);
      const block = getBlock(container);
      expect(block.style.borderRadius).toBe("16px");
    });

    it("applies numeric border-radius as px", () => {
      const { container } = render(<Skeleton variant="custom" rounded={20} />);
      const block = getBlock(container);
      expect(block.style.borderRadius).toBe("20px");
    });

    it("circle prop overrides rounded", () => {
      const { container } = render(<Skeleton variant="custom" rounded="8px" circle />);
      const block = getBlock(container);
      expect(block.style.borderRadius).toBe("50%");
    });
  });

  // ── Animation ────────────────────────────────────────────────

  describe("animation", () => {
    it("pulse: adds animate-pulse class", () => {
      const { container } = render(<Skeleton variant="text" animation="pulse" />);
      const block = getBlock(container);
      expect(block.className).toContain("animate-pulse");
    });

    it("static: no animate-pulse class", () => {
      const { container } = render(<Skeleton variant="text" animation="static" />);
      const block = getBlock(container);
      expect(block.className).not.toContain("animate-pulse");
    });

    it("shimmer: applies gradient background", () => {
      const { container } = render(<Skeleton variant="text" animation="shimmer" />);
      const block = getBlock(container);
      expect(block.style.background).toContain("linear-gradient");
      expect(block.style.backgroundSize).toBe("200% 100%");
    });

    it("shimmer: has overflow-hidden on parent", () => {
      const { container } = render(<Skeleton variant="text" animation="shimmer" />);
      const block = getBlock(container);
      expect(block.className).toContain("overflow-hidden");
    });
  });

  // ── Reduced Motion ───────────────────────────────────────────

  describe("reduced motion", () => {
    it("pulse falls back to static (no animate-pulse)", () => {
      mockReduced = true;
      const { container } = render(<Skeleton variant="text" animation="pulse" />);
      const block = getBlock(container);
      expect(block.className).not.toContain("animate-pulse");
    });

    it("shimmer falls back to static (no gradient)", () => {
      mockReduced = true;
      const { container } = render(<Skeleton variant="text" animation="shimmer" />);
      const block = getBlock(container);
      expect(block.style.background).toBe("");
    });

    it("static remains static", () => {
      mockReduced = true;
      const { container } = render(<Skeleton variant="text" animation="static" />);
      const block = getBlock(container);
      expect(block.className).not.toContain("animate-pulse");
      expect(block.style.background).toBe("");
    });

    it("still renders aria-hidden in reduced motion", () => {
      mockReduced = true;
      const { container } = render(<Skeleton variant="card" />);
      const hidden = container.querySelectorAll("[aria-hidden='true']");
      expect(hidden.length).toBeGreaterThan(0);
    });
  });

  // ── Avatar Rounded Override ──────────────────────────────────

  describe("avatar circle override", () => {
    it("ignores rounded prop, forces circle", () => {
      const { container } = render(<Skeleton variant="avatar" rounded="8px" />);
      const block = getBlock(container);
      expect(block.style.borderRadius).toBe("50%");
    });
  });
});
