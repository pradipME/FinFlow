import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Alert } from "./Alert";
import type { AlertVariant, AlertSize } from "./types";
import {
  DEFAULT_VARIANT,
  DEFAULT_SIZE,
  VARIANT_CLASSES,
  ACCENT_CLASSES,
  ICON_COLOR_CLASSES,
  SIZE_CLASSES,
  ICON_SIZES,
} from "./constants";
import {
  getAlertClasses,
  getAlertIconClasses,
  getAlertCloseButtonClasses,
  getAlertActionClasses,
} from "./styles";

describe("Alert", () => {
  it("renders children", () => {
    render(<Alert>Test content</Alert>);
    expect(screen.getByText("Test content")).toBeTruthy();
  });

  it("renders with role=alert", () => {
    render(<Alert>Test</Alert>);
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("forwards ref to the container div", () => {
    const ref = { current: null };
    render(<Alert ref={ref}>Test</Alert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe("variants", () => {
    it.each(["success", "info", "warning", "danger"] as AlertVariant[])(
      "renders %s variant with correct data attribute",
      (variant) => {
        render(<Alert variant={variant}>Test</Alert>);
        const alert = screen.getByRole("alert");
        expect(alert.getAttribute("data-variant")).toBe(variant);
      },
    );

    it("defaults to info variant", () => {
      render(<Alert>Test</Alert>);
      expect(screen.getByRole("alert").getAttribute("data-variant")).toBe(
        DEFAULT_VARIANT,
      );
    });

    it("applies variant-specific classes", () => {
      render(<Alert variant="success">Test</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert.className).toContain("bg-success-subtle");
      expect(alert.className).toContain("text-success");
    });
  });

  describe("sizes", () => {
    it.each(["sm", "md", "lg"] as AlertSize[])(
      "renders %s size classes",
      (size) => {
        render(<Alert size={size}>Test</Alert>);
        const alert = screen.getByRole("alert");
        expect(alert.className).toContain(SIZE_CLASSES[size].split(" ")[0]);
      },
    );

    it("defaults to md size", () => {
      render(<Alert>Test</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert.className).toContain(SIZE_CLASSES[DEFAULT_SIZE].split(" ")[0]);
    });
  });

  describe("accent", () => {
    it("renders accent border by default", () => {
      render(<Alert variant="success">Test</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert.className).toContain("border-l-4");
    });

    it("hides accent border when accent=false", () => {
      render(<Alert variant="success" accent={false}>Test</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert.className).not.toContain("border-l-4");
    });
  });

  describe("title", () => {
    it("renders title when provided", () => {
      render(<Alert title="Warning">Details here</Alert>);
      expect(screen.getByText("Warning")).toBeTruthy();
      expect(screen.getByText("Details here")).toBeTruthy();
    });

    it("does not render title element when not provided", () => {
      render(<Alert>Just content</Alert>);
      expect(screen.getByText("Just content")).toBeTruthy();
    });
  });

  describe("icon", () => {
    it("renders custom icon when provided", () => {
      render(
        <Alert icon={<span data-testid="custom-icon">!</span>}>Test</Alert>,
      );
      expect(screen.getByTestId("custom-icon")).toBeTruthy();
    });

    it("icon has aria-hidden", () => {
      render(
        <Alert icon={<span data-testid="icon">!</span>}>Test</Alert>,
      );
      const iconParent = screen.getByTestId("icon").parentElement;
      expect(iconParent?.getAttribute("aria-hidden")).toBe("true");
    });

    it("applies variant icon color class", () => {
      const { container } = render(
        <Alert variant="danger" icon={<span>!</span>}>Test</Alert>,
      );
      const iconWrapper = container.querySelector("[aria-hidden='true']");
      expect(iconWrapper?.className).toContain("text-danger");
    });
  });

  describe("closable", () => {
    it("does not render close button by default", () => {
      render(<Alert>Test</Alert>);
      expect(screen.queryByRole("button")).toBeNull();
    });

    it("renders close button when closable=true", () => {
      render(<Alert closable>Test</Alert>);
      expect(screen.getByRole("button")).toBeTruthy();
    });

    it("close button has aria-label", () => {
      render(<Alert closable>Test</Alert>);
      expect(
        screen.getByRole("button", { name: /dismiss alert/i }),
      ).toBeTruthy();
    });

    it("calls onClose when close button clicked", () => {
      const onClose = vi.fn();
      render(<Alert closable onClose={onClose}>Test</Alert>);
      fireEvent.click(screen.getByRole("button"));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("action", () => {
    it("renders action when provided", () => {
      render(
        <Alert action={<button>Undo</button>}>Transaction failed</Alert>,
      );
      expect(screen.getByText("Undo")).toBeTruthy();
    });

    it("does not render action when not provided", () => {
      render(<Alert>Test</Alert>);
      expect(screen.queryByText("Undo")).toBeNull();
    });
  });

  describe("accessibility", () => {
    it("success toast has aria-live=polite", () => {
      render(<Alert variant="success">Test</Alert>);
      expect(screen.getByRole("alert").getAttribute("aria-live")).toBe(
        "polite",
      );
    });

    it("danger alert has aria-live=assertive", () => {
      render(<Alert variant="danger">Test</Alert>);
      expect(screen.getByRole("alert").getAttribute("aria-live")).toBe(
        "assertive",
      );
    });

    it("info alert has aria-live=polite", () => {
      render(<Alert variant="info">Test</Alert>);
      expect(screen.getByRole("alert").getAttribute("aria-live")).toBe(
        "polite",
      );
    });

    it("warning alert has aria-live=polite", () => {
      render(<Alert variant="warning">Test</Alert>);
      expect(screen.getByRole("alert").getAttribute("aria-live")).toBe(
        "polite",
      );
    });
  });

  describe("className", () => {
    it("merges custom className", () => {
      render(<Alert className="custom-class">Test</Alert>);
      expect(screen.getByRole("alert").className).toContain("custom-class");
    });
  });

  describe("inline SVG icons", () => {
    it("does not render inline SVG icons (uses Lucide)", () => {
      render(<Alert icon={<span>!</span>}>Test</Alert>);
      const alert = screen.getByRole("alert");
      const svgs = alert.querySelectorAll("svg");
      expect(svgs.length).toBe(0);
    });
  });
});

describe("Alert styles", () => {
  describe("getAlertClasses", () => {
    it("returns string containing base classes", () => {
      const result = getAlertClasses({
        variant: "info",
        size: "md",
        accent: true,
      });
      expect(typeof result).toBe("string");
      expect(result).toContain("rounded-card");
      expect(result).toContain("border");
    });

    it("includes variant-specific classes", () => {
      const result = getAlertClasses({
        variant: "success",
        size: "md",
        accent: true,
      });
      expect(result).toContain("bg-success-subtle");
    });

    it("includes accent border", () => {
      const result = getAlertClasses({
        variant: "danger",
        size: "lg",
        accent: true,
      });
      expect(result).toContain("border-l-4");
    });

    it("excludes accent border when accent=false", () => {
      const result = getAlertClasses({
        variant: "danger",
        size: "lg",
        accent: false,
      });
      expect(result).not.toContain("border-l-4");
    });
  });

  describe("getAlertIconClasses", () => {
    it("returns variant icon color class", () => {
      expect(getAlertIconClasses("warning")).toContain("text-warning");
    });
  });

  describe("getAlertCloseButtonClasses", () => {
    it("returns close button classes", () => {
      const result = getAlertCloseButtonClasses();
      expect(result).toContain("hover:");
      expect(result).toContain("focus-visible:ring-2");
    });
  });

  describe("getAlertActionClasses", () => {
    it("returns action classes", () => {
      const result = getAlertActionClasses();
      expect(result).toContain("underline");
      expect(result).toContain("font-medium");
    });
  });
});

describe("Alert constants", () => {
  it("DEFAULT_VARIANT is info", () => {
    expect(DEFAULT_VARIANT).toBe("info");
  });

  it("DEFAULT_SIZE is md", () => {
    expect(DEFAULT_SIZE).toBe("md");
  });

  it("VARIANT_CLASSES has all variants", () => {
    expect(Object.keys(VARIANT_CLASSES)).toEqual(
      expect.arrayContaining(["success", "info", "warning", "danger"]),
    );
    expect(Object.keys(VARIANT_CLASSES)).toHaveLength(4);
  });

  it("ACCENT_CLASSES has all variants", () => {
    expect(Object.keys(ACCENT_CLASSES)).toEqual(
      expect.arrayContaining(["success", "info", "warning", "danger"]),
    );
  });

  it("ICON_COLOR_CLASSES has all variants", () => {
    expect(Object.keys(ICON_COLOR_CLASSES)).toEqual(
      expect.arrayContaining(["success", "info", "warning", "danger"]),
    );
  });

  it("SIZE_CLASSES has sm, md, lg", () => {
    expect(Object.keys(SIZE_CLASSES)).toEqual(
      expect.arrayContaining(["sm", "md", "lg"]),
    );
  });

  it("ICON_SIZES has sm, md, lg", () => {
    expect(ICON_SIZES.sm).toBe(14);
    expect(ICON_SIZES.md).toBe(16);
    expect(ICON_SIZES.lg).toBe(18);
  });
});
