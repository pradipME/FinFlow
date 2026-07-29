import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressRing } from "./ProgressRing";
import type { ProgressRingVariant, ProgressRingSize } from "./types";
import {
  DEFAULT_SIZE,
  DEFAULT_VARIANT,
  DEFAULT_MIN,
  DEFAULT_MAX,
  SIZE_MAP,
  BAR_COLORS,
  VALUE_TEXT_CLASSES,
} from "./constants";
import { getRingBarClasses, getRingValueClasses } from "./styles";

describe("ProgressRing", () => {
  it("renders an SVG element", () => {
    render(<ProgressRing value={50} />);
    expect(screen.getByRole("progressbar")).toBeTruthy();
  });

  it("has role=progressbar", () => {
    render(<ProgressRing value={50} />);
    expect(screen.getByRole("progressbar").getAttribute("role")).toBe(
      "progressbar",
    );
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<ProgressRing ref={ref} value={50} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  describe("value", () => {
    it("sets aria-valuenow", () => {
      render(<ProgressRing value={42} />);
      expect(
        screen.getByRole("progressbar").getAttribute("aria-valuenow"),
      ).toBe("42");
    });

    it("clamps value to max", () => {
      render(<ProgressRing value={150} />);
      expect(
        screen.getByRole("progressbar").getAttribute("aria-valuenow"),
      ).toBe("100");
    });

    it("clamps negative to min", () => {
      render(<ProgressRing value={-10} />);
      expect(
        screen.getByRole("progressbar").getAttribute("aria-valuenow"),
      ).toBe("0");
    });

    it("computes percentage from custom min/max", () => {
      render(<ProgressRing value={5} min={0} max={10} />);
      expect(
        screen.getByRole("progressbar").getAttribute("aria-valuenow"),
      ).toBe("50");
    });
  });

  describe("indeterminate", () => {
    it("omits aria-valuenow", () => {
      render(<ProgressRing indeterminate />);
      expect(
        screen.getByRole("progressbar").getAttribute("aria-valuenow"),
      ).toBeNull();
    });

    it("still has aria-valuemin and aria-valuemax", () => {
      render(<ProgressRing indeterminate />);
      const bar = screen.getByRole("progressbar");
      expect(bar.getAttribute("aria-valuemin")).toBe("0");
      expect(bar.getAttribute("aria-valuemax")).toBe("100");
    });
  });

  describe("label", () => {
    it("renders label as aria-label", () => {
      render(<ProgressRing value={50} label="Uploading" />);
      expect(screen.getByRole("progressbar").getAttribute("aria-label")).toBe(
        "Uploading",
      );
    });

    it("defaults aria-label to Loading progress", () => {
      render(<ProgressRing value={50} />);
      expect(screen.getByRole("progressbar").getAttribute("aria-label")).toBe(
        "Loading progress",
      );
    });
  });

  describe("showValue", () => {
    it("shows percentage in center when showValue=true", () => {
      render(<ProgressRing value={75} showValue />);
      expect(screen.getByText("75%")).toBeTruthy();
    });

    it("does not show percentage by default", () => {
      render(<ProgressRing value={75} />);
      expect(screen.queryByText("75%")).toBeNull();
    });

    it("hides percentage when indeterminate", () => {
      render(<ProgressRing indeterminate showValue />);
      expect(screen.queryByText(/%/)).toBeNull();
    });
  });

  describe("children", () => {
    it("renders children in center", () => {
      render(
        <ProgressRing value={50}>
          <span data-testid="custom-content">50</span>
        </ProgressRing>,
      );
      expect(screen.getByTestId("custom-content")).toBeTruthy();
    });

    it("children override showValue", () => {
      render(
        <ProgressRing value={50} showValue>
          <span>Custom</span>
        </ProgressRing>,
      );
      expect(screen.getByText("Custom")).toBeTruthy();
      expect(screen.queryByText("50%")).toBeNull();
    });
  });

  describe("sizes", () => {
    it.each(["sm", "md", "lg"] as ProgressRingSize[])(
      "renders %s size",
      (size) => {
        render(<ProgressRing value={50} size={size} />);
        const svg = screen.getByRole("progressbar");
        expect(svg.getAttribute("width")).toBe(
          String(SIZE_MAP[size].dimension),
        );
      },
    );
  });

  describe("variants", () => {
    it.each(["default", "success", "info", "warning", "danger"] as ProgressRingVariant[])(
      "renders %s variant",
      (variant) => {
        render(<ProgressRing value={50} variant={variant} />);
        expect(screen.getByRole("progressbar")).toBeTruthy();
      },
    );
  });

  describe("SVG structure", () => {
    it("renders track circle", () => {
      const { container } = render(<ProgressRing value={50} />);
      const circles = container.querySelectorAll("circle");
      expect(circles.length).toBeGreaterThanOrEqual(1);
    });

    it("renders bar circle when not indeterminate", () => {
      const { container } = render(<ProgressRing value={50} />);
      const circles = container.querySelectorAll("circle");
      expect(circles.length).toBe(2);
    });

    it("renders only track circle when indeterminate", () => {
      const { container } = render(<ProgressRing indeterminate />);
      const circles = container.querySelectorAll("circle");
      expect(circles.length).toBe(1);
    });
  });

  describe("className", () => {
    it("merges custom className", () => {
      render(<ProgressRing value={50} className="custom-class" />);
      const wrapper = screen.getByRole("progressbar").parentElement;
      expect(wrapper?.className).toContain("custom-class");
    });
  });
});

describe("ProgressRing styles", () => {
  describe("getRingBarClasses", () => {
    it("returns variant bar class", () => {
      expect(
        getRingBarClasses({ variant: "success", indeterminate: false }),
      ).toContain("text-success");
    });

    it("includes transition classes", () => {
      const result = getRingBarClasses({ variant: "default", indeterminate: false });
      expect(result).toContain("transition-[stroke-dashoffset]");
    });
  });

  describe("getRingValueClasses", () => {
    it("returns centered absolute classes", () => {
      const result = getRingValueClasses("md");
      expect(result).toContain("absolute");
      expect(result).toContain("flex");
      expect(result).toContain("items-center");
      expect(result).toContain("justify-center");
    });

    it("includes size text class", () => {
      expect(getRingValueClasses("sm")).toContain("text-xs");
      expect(getRingValueClasses("lg")).toContain("text-base");
    });
  });
});

describe("ProgressRing constants", () => {
  it("DEFAULT_SIZE is md", () => expect(DEFAULT_SIZE).toBe("md"));
  it("DEFAULT_VARIANT is default", () => expect(DEFAULT_VARIANT).toBe("default"));
  it("DEFAULT_MIN is 0", () => expect(DEFAULT_MIN).toBe(0));
  it("DEFAULT_MAX is 100", () => expect(DEFAULT_MAX).toBe(100));

  it("SIZE_MAP has all sizes", () => {
    expect(Object.keys(SIZE_MAP)).toEqual(
      expect.arrayContaining(["sm", "md", "lg"]),
    );
  });

  it("BAR_COLORS has all variants", () => {
    expect(Object.keys(BAR_COLORS)).toEqual(
      expect.arrayContaining(["default", "success", "info", "warning", "danger"]),
    );
  });

  it("VALUE_TEXT_CLASSES has all sizes", () => {
    expect(Object.keys(VALUE_TEXT_CLASSES)).toEqual(
      expect.arrayContaining(["sm", "md", "lg"]),
    );
  });
});
