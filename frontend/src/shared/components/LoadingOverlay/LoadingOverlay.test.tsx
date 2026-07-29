import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingOverlay } from "./LoadingOverlay";
import type { LoadingOverlayMode } from "./types";
import {
  DEFAULT_MODE,
  DEFAULT_LABEL,
  DEFAULT_OPACITY,
  MODE_CLASSES,
  SPINNER_SIZE,
} from "./constants";
import {
  getOverlayClasses,
  getOverlayContentClasses,
  getOverlayLabelClasses,
} from "./styles";

describe("LoadingOverlay", () => {
  describe("loading state", () => {
    it("renders children when loading=false", () => {
      render(
        <LoadingOverlay loading={false}>
          <div data-testid="content">Content</div>
        </LoadingOverlay>,
      );
      expect(screen.getByTestId("content")).toBeTruthy();
      expect(screen.queryByTestId("loading-overlay")).toBeNull();
    });

    it("renders overlay when loading=true", () => {
      render(
        <LoadingOverlay loading>
          <div>Content</div>
        </LoadingOverlay>,
      );
      expect(screen.getByTestId("loading-overlay")).toBeTruthy();
    });

    it("still renders children when loading", () => {
      render(
        <LoadingOverlay loading>
          <div data-testid="content">Content</div>
        </LoadingOverlay>,
      );
      expect(screen.getByTestId("content")).toBeTruthy();
    });
  });

  describe("accessibility", () => {
    it("has role=status", () => {
      render(
        <LoadingOverlay loading>
          <div />
        </LoadingOverlay>,
      );
      expect(screen.getByRole("status")).toBeTruthy();
    });

    it("has aria-live=polite", () => {
      render(
        <LoadingOverlay loading>
          <div />
        </LoadingOverlay>,
      );
      expect(screen.getByRole("status").getAttribute("aria-live")).toBe(
        "polite",
      );
    });

    it("uses label as aria-label", () => {
      render(
        <LoadingOverlay loading label="Saving">
          <div />
        </LoadingOverlay>,
      );
      expect(screen.getByRole("status").getAttribute("aria-label")).toBe(
        "Saving",
      );
    });

    it("defaults aria-label to Loading", () => {
      render(
        <LoadingOverlay loading>
          <div />
        </LoadingOverlay>,
      );
      expect(screen.getByRole("status").getAttribute("aria-label")).toBe(
        DEFAULT_LABEL,
      );
    });
  });

  describe("mode", () => {
    it.each(["overlay", "fullscreen"] as LoadingOverlayMode[])(
      "renders %s mode",
      (mode) => {
        render(
          <LoadingOverlay loading mode={mode}>
            <div />
          </LoadingOverlay>,
        );
        expect(screen.getByTestId("loading-overlay")).toBeTruthy();
      },
    );

    it("defaults to overlay mode", () => {
      render(
        <LoadingOverlay loading>
          <div />
        </LoadingOverlay>,
      );
      const overlay = screen.getByTestId("loading-overlay");
      expect(overlay.className).toContain("absolute");
    });

    it("fullscreen uses fixed positioning", () => {
      render(
        <LoadingOverlay loading mode="fullscreen">
          <div />
        </LoadingOverlay>,
      );
      const overlay = screen.getByTestId("loading-overlay");
      expect(overlay.className).toContain("fixed");
    });
  });

  describe("label", () => {
    it("renders label text", () => {
      render(
        <LoadingOverlay loading label="Processing payment">
          <div />
        </LoadingOverlay>,
      );
      expect(screen.getByText("Processing payment")).toBeTruthy();
    });

    it("renders default label", () => {
      render(
        <LoadingOverlay loading>
          <div />
        </LoadingOverlay>,
      );
      expect(screen.getByText(DEFAULT_LABEL)).toBeTruthy();
    });
  });

  describe("spinner", () => {
    it("renders default SVG spinner", () => {
      const { container } = render(
        <LoadingOverlay loading>
          <div />
        </LoadingOverlay>,
      );
      const svg = container.querySelector("svg");
      expect(svg).toBeTruthy();
    });

    it("spinner has aria-hidden", () => {
      const { container } = render(
        <LoadingOverlay loading>
          <div />
        </LoadingOverlay>,
      );
      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("aria-hidden")).toBe("true");
    });

    it("renders custom spinner when provided", () => {
      render(
        <LoadingOverlay loading spinner={<div data-testid="custom-spinner" />}>
          <div />
        </LoadingOverlay>,
      );
      expect(screen.getByTestId("custom-spinner")).toBeTruthy();
    });
  });

  describe("backdrop", () => {
    it("has backdrop classes by default", () => {
      render(
        <LoadingOverlay loading>
          <div />
        </LoadingOverlay>,
      );
      const overlay = screen.getByTestId("loading-overlay");
      expect(overlay.className).toContain("backdrop-blur-sm");
    });

    it("removes backdrop classes when backdrop=false", () => {
      render(
        <LoadingOverlay loading backdrop={false}>
          <div />
        </LoadingOverlay>,
      );
      const overlay = screen.getByTestId("loading-overlay");
      expect(overlay.className).not.toContain("backdrop-blur-sm");
    });
  });

  describe("className", () => {
    it("merges custom className", () => {
      render(
        <LoadingOverlay loading className="custom-class">
          <div />
        </LoadingOverlay>,
      );
      expect(screen.getByTestId("loading-overlay").className).toContain(
        "custom-class",
      );
    });
  });

  describe("container", () => {
    it("wraps in relative container", () => {
      render(
        <LoadingOverlay loading>
          <div />
        </LoadingOverlay>,
      );
      expect(screen.getByTestId("loading-overlay-container")).toBeTruthy();
    });
  });
});

describe("LoadingOverlay styles", () => {
  describe("getOverlayClasses", () => {
    it("returns string containing overlay classes", () => {
      const result = getOverlayClasses({
        mode: "overlay",
        backdrop: true,
      });
      expect(result).toContain("absolute");
      expect(result).toContain("z-toast");
    });

    it("includes backdrop classes when backdrop=true", () => {
      const result = getOverlayClasses({
        mode: "overlay",
        backdrop: true,
      });
      expect(result).toContain("backdrop-blur-sm");
    });

    it("excludes backdrop classes when backdrop=false", () => {
      const result = getOverlayClasses({
        mode: "overlay",
        backdrop: false,
      });
      expect(result).not.toContain("backdrop-blur-sm");
    });

    it("merges custom className", () => {
      const result = getOverlayClasses({
        mode: "overlay",
        backdrop: false,
        className: "custom",
      });
      expect(result).toContain("custom");
    });
  });

  describe("getOverlayContentClasses", () => {
    it("returns content classes", () => {
      const result = getOverlayContentClasses();
      expect(result).toContain("flex");
      expect(result).toContain("items-center");
      expect(result).toContain("z-10");
    });
  });

  describe("getOverlayLabelClasses", () => {
    it("returns label classes", () => {
      const result = getOverlayLabelClasses();
      expect(result).toContain("text-sm");
      expect(result).toContain("text-text-secondary");
    });
  });
});

describe("LoadingOverlay constants", () => {
  it("DEFAULT_MODE is overlay", () => expect(DEFAULT_MODE).toBe("overlay"));
  it("DEFAULT_LABEL is Loading", () => expect(DEFAULT_LABEL).toBe("Loading"));
  it("DEFAULT_OPACITY is 0.6", () => expect(DEFAULT_OPACITY).toBe(0.6));
  it("SPINNER_SIZE is 32", () => expect(SPINNER_SIZE).toBe(32));

  it("MODE_CLASSES has overlay and fullscreen", () => {
    expect(Object.keys(MODE_CLASSES)).toEqual(
      expect.arrayContaining(["overlay", "fullscreen"]),
    );
  });
});
