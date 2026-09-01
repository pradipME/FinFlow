import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorState } from "./ErrorState";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DEFAULT_TITLE, DEFAULT_RETRY_LABEL, ICON_CLASSES, ERROR_CODE_CLASSES } from "./constants";
import {
  getErrorStateClasses,
  getErrorStateIconClasses,
  getErrorStateTitleClasses,
  getErrorStateDescriptionClasses,
  getErrorCodeClasses,
  getErrorStateActionsClasses,
} from "./styles";

describe("ErrorState", () => {
  it("renders without crashing", () => {
    render(<ErrorState />);
    expect(screen.getByTestId("error-state")).toBeTruthy();
  });

  it("has role=alert", () => {
    render(<ErrorState />);
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<ErrorState ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe("title", () => {
    it("renders default title", () => {
      render(<ErrorState />);
      expect(screen.getByText(DEFAULT_TITLE)).toBeTruthy();
    });

    it("renders custom title", () => {
      render(<ErrorState title="Connection failed" />);
      expect(screen.getByText("Connection failed")).toBeTruthy();
    });

    it("title is a heading", () => {
      render(<ErrorState />);
      expect(screen.getByRole("heading")).toBeTruthy();
    });
  });

  describe("description", () => {
    it("renders description when provided", () => {
      render(
        <ErrorState description="Please check your internet connection" />,
      );
      expect(
        screen.getByText("Please check your internet connection"),
      ).toBeTruthy();
    });

    it("does not render description when not provided", () => {
      render(<ErrorState />);
      expect(screen.queryByText(/check your internet/)).toBeNull();
    });
  });

  describe("errorCode", () => {
    it("renders error code when provided", () => {
      render(<ErrorState errorCode={404} />);
      expect(screen.getByText("Error 404")).toBeTruthy();
    });

    it("renders string error code", () => {
      render(<ErrorState errorCode="NET_ERR" />);
      expect(screen.getByText("Error NET_ERR")).toBeTruthy();
    });

    it("does not render error code when not provided", () => {
      render(<ErrorState />);
      expect(screen.queryByText(/Error/)).toBeNull();
    });
  });

  describe("icon", () => {
    it("renders default AlertTriangle icon", () => {
      const { container } = render(<ErrorState />);
      const svg = container.querySelector("svg");
      expect(svg).toBeTruthy();
    });

    it("renders custom icon when provided", () => {
      render(
        <ErrorState icon={<span data-testid="custom-icon">!</span>} />,
      );
      expect(screen.getByTestId("custom-icon")).toBeTruthy();
    });

    it("icon container has aria-hidden", () => {
      render(<ErrorState />);
      const iconContainer = screen
        .getByTestId("error-state")
        .querySelector("[aria-hidden='true']");
      expect(iconContainer).toBeTruthy();
    });
  });

  describe("onRetry", () => {
    it("renders retry button when onRetry provided", () => {
      render(<ErrorState onRetry={() => {}} />);
      expect(screen.getByRole("button", { name: DEFAULT_RETRY_LABEL })).toBeTruthy();
    });

    it("calls onRetry when clicked", () => {
      const onRetry = vi.fn();
      render(<ErrorState onRetry={onRetry} />);
      fireEvent.click(screen.getByRole("button"));
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("renders custom retryLabel", () => {
      render(<ErrorState onRetry={() => {}} retryLabel="Reload page" />);
      expect(screen.getByText("Reload page")).toBeTruthy();
    });

    it("does not render retry button when onRetry not provided", () => {
      render(<ErrorState />);
      expect(screen.queryByRole("button")).toBeNull();
    });
  });

  describe("secondaryAction", () => {
    it("renders secondaryAction alongside retry", () => {
      render(
        <ErrorState
          onRetry={() => {}}
          secondaryAction={<button>Contact support</button>}
        />,
      );
      expect(screen.getByText(DEFAULT_RETRY_LABEL)).toBeTruthy();
      expect(screen.getByText("Contact support")).toBeTruthy();
    });
  });

  describe("className", () => {
    it("merges custom className", () => {
      render(<ErrorState className="custom-class" />);
      expect(screen.getByTestId("error-state").className).toContain(
        "custom-class",
      );
    });
  });

  describe("children", () => {
    it("renders children", () => {
      render(
        <ErrorState>
          <div data-testid="child">Custom content</div>
        </ErrorState>,
      );
      expect(screen.getByTestId("child")).toBeTruthy();
    });
  });
});

describe("ErrorState styles", () => {
  describe("getErrorStateClasses", () => {
    it("returns string containing wrapper classes", () => {
      const result = getErrorStateClasses();
      expect(result).toContain("flex");
      expect(result).toContain("items-center");
    });

    it("merges custom className", () => {
      expect(getErrorStateClasses("custom")).toContain("custom");
    });
  });

  describe("getErrorStateIconClasses", () => {
    it("returns icon classes with danger color", () => {
      expect(getErrorStateIconClasses()).toContain("text-danger");
    });
  });

  describe("getErrorStateTitleClasses", () => {
    it("returns title classes", () => {
      expect(getErrorStateTitleClasses()).toContain("font-semibold");
    });
  });

  describe("getErrorStateDescriptionClasses", () => {
    it("returns description classes", () => {
      expect(getErrorStateDescriptionClasses()).toContain("text-text-secondary");
    });
  });

  describe("getErrorCodeClasses", () => {
    it("returns error code classes", () => {
      expect(getErrorCodeClasses()).toContain("font-mono");
      expect(getErrorCodeClasses()).toContain("text-text-tertiary");
    });
  });

  describe("getErrorStateActionsClasses", () => {
    it("returns actions classes", () => {
      expect(getErrorStateActionsClasses()).toContain("flex");
      expect(getErrorStateActionsClasses()).toContain("gap-3");
    });
  });
});

describe("ErrorState constants", () => {
  it("DEFAULT_TITLE is Something went wrong", () => {
    expect(DEFAULT_TITLE).toBe("Something went wrong");
  });

  it("DEFAULT_RETRY_LABEL is Try again", () => {
    expect(DEFAULT_RETRY_LABEL).toBe("Try again");
  });

  it("ICON_CLASSES contains text-danger", () => {
    expect(ICON_CLASSES).toContain("text-danger");
  });

  it("ERROR_CODE_CLASSES contains font-mono", () => {
    expect(ERROR_CODE_CLASSES).toContain("font-mono");
  });
});
