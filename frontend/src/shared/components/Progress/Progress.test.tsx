import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress } from "./Progress";
import type { ProgressVariant, ProgressSize } from "./types";
import {
  DEFAULT_SIZE,
  DEFAULT_VARIANT,
  DEFAULT_MIN,
  DEFAULT_MAX,
  TRACK_CLASSES,
  BAR_CLASSES,
  VALUE_TEXT_CLASSES,
} from "./constants";
import {
  getTrackClasses,
  getBarClasses,
  getValueTextClasses,
} from "./styles";

describe("Progress", () => {
  it("renders without crashing", () => {
    render(<Progress value={50} />);
    expect(screen.getByRole("progressbar")).toBeTruthy();
  });

  it("has role=progressbar", () => {
    render(<Progress value={50} />);
    expect(screen.getByRole("progressbar").getAttribute("role")).toBe(
      "progressbar",
    );
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<Progress ref={ref} value={50} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe("value", () => {
    it("sets aria-valuenow", () => {
      render(<Progress value={42} />);
      expect(
        screen.getByRole("progressbar").getAttribute("aria-valuenow"),
      ).toBe("42");
    });

    it("clamps value to min/max", () => {
      render(<Progress value={150} />);
      expect(
        screen.getByRole("progressbar").getAttribute("aria-valuenow"),
      ).toBe("100");
    });

    it("clamps negative to min", () => {
      render(<Progress value={-10} />);
      expect(
        screen.getByRole("progressbar").getAttribute("aria-valuenow"),
      ).toBe("0");
    });

    it("computes percentage from custom min/max", () => {
      render(<Progress value={5} min={0} max={10} />);
      expect(
        screen.getByRole("progressbar").getAttribute("aria-valuenow"),
      ).toBe("50");
    });

    it("defaults to value=0", () => {
      render(<Progress />);
      expect(
        screen.getByRole("progressbar").getAttribute("aria-valuenow"),
      ).toBe("0");
    });
  });

  describe("indeterminate", () => {
    it("omits aria-valuenow when indeterminate", () => {
      render(<Progress indeterminate />);
      expect(
        screen.getByRole("progressbar").getAttribute("aria-valuenow"),
      ).toBeNull();
    });

    it("still has aria-valuemin and aria-valuemax", () => {
      render(<Progress indeterminate />);
      const bar = screen.getByRole("progressbar");
      expect(bar.getAttribute("aria-valuemin")).toBe("0");
      expect(bar.getAttribute("aria-valuemax")).toBe("100");
    });
  });

  describe("label", () => {
    it("renders label text", () => {
      render(<Progress value={50} label="Uploading" />);
      expect(screen.getByText("Uploading")).toBeTruthy();
    });

    it("sets aria-label from string label", () => {
      render(<Progress value={50} label="Uploading" />);
      expect(screen.getByRole("progressbar").getAttribute("aria-label")).toBe(
        "Uploading",
      );
    });

    it("defaults aria-label to Loading progress", () => {
      render(<Progress value={50} />);
      expect(screen.getByRole("progressbar").getAttribute("aria-label")).toBe(
        "Loading progress",
      );
    });
  });

  describe("showValue", () => {
    it("shows percentage text when showValue=true", () => {
      render(<Progress value={75} showValue />);
      expect(screen.getByText("75%")).toBeTruthy();
    });

    it("does not show percentage by default", () => {
      render(<Progress value={75} />);
      expect(screen.queryByText("75%")).toBeNull();
    });

    it("hides percentage when indeterminate", () => {
      render(<Progress indeterminate showValue />);
      expect(screen.queryByText(/%/)).toBeNull();
    });
  });

  describe("variants", () => {
    it.each(["default", "success", "info", "warning", "danger"] as ProgressVariant[])(
      "renders %s variant",
      (variant) => {
        render(<Progress value={50} variant={variant} />);
        const bar = screen.getByRole("progressbar");
        expect(bar).toBeTruthy();
      },
    );

    it("defaults to default variant", () => {
      render(<Progress value={50} />);
      expect(screen.getByRole("progressbar")).toBeTruthy();
    });
  });

  describe("sizes", () => {
    it.each(["sm", "md", "lg"] as ProgressSize[])(
      "renders %s size",
      (size) => {
        render(<Progress value={50} size={size} />);
        expect(screen.getByRole("progressbar")).toBeTruthy();
      },
    );
  });

  describe("striped", () => {
    it("accepts striped prop", () => {
      render(<Progress value={50} striped />);
      expect(screen.getByRole("progressbar")).toBeTruthy();
    });
  });

  describe("className", () => {
    it("merges custom className", () => {
      render(<Progress value={50} className="custom-class" />);
      expect(
        screen.getByRole("progressbar").className,
      ).toContain("custom-class");
    });
  });
});

describe("Progress styles", () => {
  describe("getTrackClasses", () => {
    it("returns string containing track classes", () => {
      const result = getTrackClasses({ size: "md" });
      expect(result).toContain("rounded-full");
      expect(result).toContain("w-full");
    });

    it("includes size-specific height", () => {
      const sm = getTrackClasses({ size: "sm" });
      expect(sm).toContain("h-1");
      const lg = getTrackClasses({ size: "lg" });
      expect(lg).toContain("h-3");
    });

    it("merges custom className", () => {
      const result = getTrackClasses({ size: "md", className: "my-class" });
      expect(result).toContain("my-class");
    });
  });

  describe("getBarClasses", () => {
    it("returns variant bar class", () => {
      expect(getBarClasses({ variant: "success", striped: false, indeterminate: false })).toContain(
        "bg-success",
      );
    });

    it("includes striped classes", () => {
      const result = getBarClasses({ variant: "default", striped: true, indeterminate: false });
      expect(result).toContain("bg-[length");
    });

    it("includes indeterminate class", () => {
      const result = getBarClasses({ variant: "default", striped: false, indeterminate: true });
      expect(result).toContain("animate-[indeterminate");
    });
  });

  describe("getValueTextClasses", () => {
    it("returns size text class", () => {
      expect(getValueTextClasses("sm")).toContain("text-xs");
      expect(getValueTextClasses("lg")).toContain("text-base");
    });
  });
});

describe("Progress constants", () => {
  it("DEFAULT_SIZE is md", () => expect(DEFAULT_SIZE).toBe("md"));
  it("DEFAULT_VARIANT is default", () => expect(DEFAULT_VARIANT).toBe("default"));
  it("DEFAULT_MIN is 0", () => expect(DEFAULT_MIN).toBe(0));
  it("DEFAULT_MAX is 100", () => expect(DEFAULT_MAX).toBe(100));

  it("TRACK_CLASSES has all sizes", () => {
    expect(Object.keys(TRACK_CLASSES)).toEqual(
      expect.arrayContaining(["sm", "md", "lg"]),
    );
  });

  it("BAR_CLASSES has all variants", () => {
    expect(Object.keys(BAR_CLASSES)).toEqual(
      expect.arrayContaining(["default", "success", "info", "warning", "danger"]),
    );
  });

  it("VALUE_TEXT_CLASSES has all sizes", () => {
    expect(Object.keys(VALUE_TEXT_CLASSES)).toEqual(
      expect.arrayContaining(["sm", "md", "lg"]),
    );
  });
});
