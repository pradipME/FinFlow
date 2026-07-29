import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";

// ── Mock: useReducedMotion ───────────────────────────────────────
// Default: motion enabled (reduced = false)
let mockReduced = false;

vi.mock("@/shared/motion", () => ({
  useReducedMotion: () => mockReduced,
  duration: { normal: 400, slow: 500, slowest: 800 },
  easing: {
    out: [0, 0, 0.2, 1],
    "in-out": [0.4, 0, 0.2, 1],
  },
}));

beforeEach(() => {
  mockReduced = false;
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── Rendering ────────────────────────────────────────────────────

describe("Spinner", () => {
  it("renders without crashing", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("renders with default variant (ring)", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders label text when provided", () => {
    render(<Spinner label="Loading..." />);
    const labels = screen.getAllByText("Loading...");
    expect(labels.length).toBe(2); // visible + sr-only
  });

  it("hides label when not provided", () => {
    const { container } = render(<Spinner />);
    const spans = container.querySelectorAll("span:not(.sr-only)");
    expect(spans.length).toBe(0);
  });

  // ── Accessibility ────────────────────────────────────────────

  it("has role=status", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("has aria-live=polite", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  it("has aria-busy=true", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  });

  it("uses label as aria-label", () => {
    render(<Spinner label="Fetching data" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Fetching data");
  });

  it("defaults aria-label to Loading when no label", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading");
  });

  it("renders screen-reader only text", () => {
    render(<Spinner label="Saving" />);
    const srOnly = screen.getByText("Saving", { selector: ".sr-only" });
    expect(srOnly).toBeTruthy();
  });

  it("sr-only text defaults to Loading when no label", () => {
    render(<Spinner />);
    const srOnly = screen.getByText("Loading", { selector: ".sr-only" });
    expect(srOnly).toBeTruthy();
  });

  // ── Variants ─────────────────────────────────────────────────

  describe("ring", () => {
    it("renders SVG", () => {
      const { container } = render(<Spinner variant="ring" />);
      expect(container.querySelector("svg")).toBeTruthy();
    });

    it("renders background track circle", () => {
      const { container } = render(<Spinner variant="ring" />);
      const circles = container.querySelectorAll("svg circle");
      expect(circles.length).toBe(2);
    });
  });

  describe("dots", () => {
    it("renders three dots", () => {
      const { container } = render(<Spinner variant="dots" />);
      const dotContainer = container.querySelector(".flex.items-center.gap-1");
      expect(dotContainer).toBeTruthy();
      expect(dotContainer!.children.length).toBe(3);
    });

    it("each dot is a rounded-full span", () => {
      const { container } = render(<Spinner variant="dots" />);
      const dots = container.querySelectorAll(".flex.items-center.gap-1 > span");
      dots.forEach((dot) => {
        expect(dot.className).toContain("rounded-full");
        expect(dot.className).toContain("bg-brand-primary");
      });
    });
  });

  describe("pulse", () => {
    it("renders a single pulsing circle", () => {
      const { container } = render(<Spinner variant="pulse" />);
      const pulse = container.querySelector(".rounded-full.bg-brand-primary");
      expect(pulse).toBeTruthy();
    });
  });

  describe("bars", () => {
    it("renders four bars", () => {
      const { container } = render(<Spinner variant="bars" />);
      const barContainer = container.querySelector(".flex.items-end");
      expect(barContainer).toBeTruthy();
      expect(barContainer!.children.length).toBe(4);
    });

    it("each bar is a rounded-sm span", () => {
      const { container } = render(<Spinner variant="bars" />);
      const bars = container.querySelectorAll(".flex.items-end > span");
      bars.forEach((bar) => {
        expect(bar.className).toContain("rounded-sm");
        expect(bar.className).toContain("bg-brand-primary");
      });
    });
  });

  // ── Sizes ────────────────────────────────────────────────────

  describe("sizes", () => {
    it("xs: container has gap-1", () => {
      const { container } = render(<Spinner size="xs" variant="ring" />);
      const wrapper = container.firstElementChild!;
      expect(wrapper.className).toContain("gap-1");
    });

    it("sm: container has gap-1.5", () => {
      const { container } = render(<Spinner size="sm" variant="ring" />);
      const wrapper = container.firstElementChild!;
      expect(wrapper.className).toContain("gap-1.5");
    });

    it("md: container has gap-2", () => {
      const { container } = render(<Spinner size="md" variant="ring" />);
      const wrapper = container.firstElementChild!;
      expect(wrapper.className).toContain("gap-2");
    });

    it("lg: container has gap-2.5", () => {
      const { container } = render(<Spinner size="lg" variant="ring" />);
      const wrapper = container.firstElementChild!;
      expect(wrapper.className).toContain("gap-2.5");
    });

    it("xl: container has gap-3", () => {
      const { container } = render(<Spinner size="xl" variant="ring" />);
      const wrapper = container.firstElementChild!;
      expect(wrapper.className).toContain("gap-3");
    });
  });

  // ── Modes ────────────────────────────────────────────────────

  describe("modes", () => {
    it("inline: default mode, no fixed/absolute classes", () => {
      const { container } = render(<Spinner mode="inline" />);
      const wrapper = container.firstElementChild!;
      expect(wrapper.className).toContain("inline-flex");
      expect(wrapper.className).not.toContain("fixed");
      expect(wrapper.className).not.toContain("absolute");
    });

    it("overlay: has absolute inset-0 and backdrop-blur", () => {
      const { container } = render(<Spinner mode="overlay" />);
      const wrapper = container.firstElementChild!;
      expect(wrapper.className).toContain("absolute");
      expect(wrapper.className).toContain("inset-0");
      expect(wrapper.className).toContain("backdrop-blur-sm");
    });

    it("fullscreen: has fixed inset-0 and backdrop-blur", () => {
      const { container } = render(<Spinner mode="fullscreen" />);
      const wrapper = container.firstElementChild!;
      expect(wrapper.className).toContain("fixed");
      expect(wrapper.className).toContain("inset-0");
      expect(wrapper.className).toContain("backdrop-blur-sm");
    });

    it("fullscreen has higher z-index than overlay", () => {
      const { container: overlayContainer } = render(<Spinner mode="overlay" />);
      const { container: fsContainer } = render(<Spinner mode="fullscreen" />);
      const overlayWrapper = overlayContainer.firstElementChild!;
      const fsWrapper = fsContainer.firstElementChild!;
      expect(overlayWrapper.className).toContain("z-10");
      expect(fsWrapper.className).toContain("z-50");
    });
  });

  // ── Label Text Size ──────────────────────────────────────────

  it("renders label with xs text size", () => {
    render(<Spinner size="xs" label="Small" />);
    const labels = screen.getAllByText("Small");
    const visible = labels.find((el) => !el.className.includes("sr-only"))!;
    expect(visible.className).toContain("text-[10px]");
  });

  it("renders label with md text size", () => {
    render(<Spinner size="md" label="Medium" />);
    const labels = screen.getAllByText("Medium");
    const visible = labels.find((el) => !el.className.includes("sr-only"))!;
    expect(visible.className).toContain("text-sm");
  });

  it("renders label with xl text size", () => {
    render(<Spinner size="xl" label="Large" />);
    const labels = screen.getAllByText("Large");
    const visible = labels.find((el) => !el.className.includes("sr-only"))!;
    expect(visible.className).toContain("text-lg");
  });

  // ── Custom className ─────────────────────────────────────────

  it("merges custom className", () => {
    const { container } = render(<Spinner className="my-custom-class" />);
    const wrapper = container.firstElementChild!;
    expect(wrapper.className).toContain("my-custom-class");
  });

  it("custom className does not override mode classes", () => {
    const { container } = render(<Spinner mode="fullscreen" className="extra" />);
    const wrapper = container.firstElementChild!;
    expect(wrapper.className).toContain("fixed");
    expect(wrapper.className).toContain("extra");
  });

  // ── Reduced Motion ───────────────────────────────────────────

  describe("reduced motion", () => {
    it("ring: renders static SVG (no animated circle)", () => {
      mockReduced = true;
      const { container } = render(<Spinner variant="ring" />);
      const circles = container.querySelectorAll("svg circle");
      // Static ring has 1 circle (no animated arc)
      expect(circles.length).toBe(1);
    });

    it("dots: renders three static dots", () => {
      mockReduced = true;
      const { container } = render(<Spinner variant="dots" />);
      const dots = container.querySelectorAll(".flex.items-center.gap-1 > span");
      expect(dots.length).toBe(3);
      // Static dots have fixed opacity
      expect(dots[0].getAttribute("style")).toContain("opacity: 0.6");
    });

    it("pulse: renders static circle at 0.6 opacity", () => {
      mockReduced = true;
      const { container } = render(<Spinner variant="pulse" />);
      const pulse = container.querySelector(".rounded-full.bg-brand-primary");
      expect(pulse!.getAttribute("style")).toContain("opacity: 0.6");
    });

    it("bars: renders four static bars with staggered heights", () => {
      mockReduced = true;
      const { container } = render(<Spinner variant="bars" />);
      const bars = container.querySelectorAll(".flex.items-end > span");
      expect(bars.length).toBe(4);
      // Each bar has a different height
      const heights = Array.from(bars).map(
        (b) => b.getAttribute("style")!.match(/height: (\d+)/)?.[1],
      );
      expect(new Set(heights).size).toBe(4);
    });

    it("still has accessible attributes in reduced motion", () => {
      mockReduced = true;
      render(<Spinner label="Loading" />);
      const status = screen.getByRole("status");
      expect(status).toHaveAttribute("aria-live", "polite");
      expect(status).toHaveAttribute("aria-busy", "true");
      expect(status).toHaveAttribute("aria-label", "Loading");
    });
  });
});
