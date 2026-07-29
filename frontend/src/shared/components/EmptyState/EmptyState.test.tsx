import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";
import {
  WRAPPER_CLASSES,
  ICON_CLASSES,
  TITLE_CLASSES,
  DESCRIPTION_CLASSES,
  ACTIONS_CLASSES,
} from "./constants";
import {
  getEmptyStateClasses,
  getEmptyStateIconClasses,
  getEmptyStateTitleClasses,
  getEmptyStateDescriptionClasses,
  getEmptyStateActionsClasses,
} from "./styles";

describe("EmptyState", () => {
  it("renders without crashing", () => {
    render(<EmptyState title="No data" />);
    expect(screen.getByText("No data")).toBeTruthy();
  });

  it("renders with data-testid", () => {
    render(<EmptyState title="Empty" />);
    expect(screen.getByTestId("empty-state")).toBeTruthy();
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<EmptyState ref={ref} title="Empty" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe("title", () => {
    it("renders title as heading", () => {
      render(<EmptyState title="No transactions" />);
      const heading = screen.getByRole("heading", { name: "No transactions" });
      expect(heading).toBeTruthy();
    });
  });

  describe("description", () => {
    it("renders description when provided", () => {
      render(
        <EmptyState
          title="No data"
          description="Get started by adding your first account"
        />,
      );
      expect(
        screen.getByText("Get started by adding your first account"),
      ).toBeTruthy();
    });

    it("does not render description when not provided", () => {
      render(<EmptyState title="No data" />);
      expect(screen.queryByText(/Get started/)).toBeNull();
    });
  });

  describe("icon", () => {
    it("renders icon when provided", () => {
      render(
        <EmptyState
          icon={<span data-testid="empty-icon">📭</span>}
          title="No data"
        />,
      );
      expect(screen.getByTestId("empty-icon")).toBeTruthy();
    });

    it("icon has aria-hidden", () => {
      render(
        <EmptyState
          icon={<span data-testid="icon">!</span>}
          title="No data"
        />,
      );
      const iconParent = screen.getByTestId("icon").parentElement;
      expect(iconParent?.getAttribute("aria-hidden")).toBe("true");
    });

    it("does not render icon container when not provided", () => {
      render(<EmptyState title="No data" />);
      expect(screen.queryByTestId("empty-icon")).toBeNull();
    });
  });

  describe("action", () => {
    it("renders action when provided", () => {
      render(
        <EmptyState
          title="No accounts"
          action={<button>Add Account</button>}
        />,
      );
      expect(screen.getByText("Add Account")).toBeTruthy();
    });

    it("renders secondaryAction alongside action", () => {
      render(
        <EmptyState
          title="No accounts"
          action={<button>Add Account</button>}
          secondaryAction={<button>Learn More</button>}
        />,
      );
      expect(screen.getByText("Add Account")).toBeTruthy();
      expect(screen.getByText("Learn More")).toBeTruthy();
    });

    it("does not render actions when not provided", () => {
      render(<EmptyState title="No data" />);
      expect(screen.queryByRole("button")).toBeNull();
    });
  });

  describe("className", () => {
    it("merges custom className", () => {
      render(<EmptyState title="Empty" className="my-class" />);
      expect(screen.getByTestId("empty-state").className).toContain(
        "my-class",
      );
    });
  });

  describe("children", () => {
    it("renders children", () => {
      render(
        <EmptyState title="Empty">
          <div data-testid="child">Custom content</div>
        </EmptyState>,
      );
      expect(screen.getByTestId("child")).toBeTruthy();
    });
  });
});

describe("EmptyState styles", () => {
  describe("getEmptyStateClasses", () => {
    it("returns string containing wrapper classes", () => {
      const result = getEmptyStateClasses();
      expect(result).toContain("flex");
      expect(result).toContain("items-center");
      expect(result).toContain("justify-center");
    });

    it("merges custom className", () => {
      const result = getEmptyStateClasses("custom");
      expect(result).toContain("custom");
    });
  });

  describe("getEmptyStateIconClasses", () => {
    it("returns icon classes", () => {
      expect(getEmptyStateIconClasses()).toContain("mb-4");
      expect(getEmptyStateIconClasses()).toContain("text-text-tertiary");
    });
  });

  describe("getEmptyStateTitleClasses", () => {
    it("returns title classes", () => {
      expect(getEmptyStateTitleClasses()).toContain("font-semibold");
      expect(getEmptyStateTitleClasses()).toContain("text-text-primary");
    });
  });

  describe("getEmptyStateDescriptionClasses", () => {
    it("returns description classes", () => {
      expect(getEmptyStateDescriptionClasses()).toContain("text-text-secondary");
      expect(getEmptyStateDescriptionClasses()).toContain("max-w-sm");
    });
  });

  describe("getEmptyStateActionsClasses", () => {
    it("returns actions classes", () => {
      expect(getEmptyStateActionsClasses()).toContain("flex");
      expect(getEmptyStateActionsClasses()).toContain("gap-3");
    });
  });
});

describe("EmptyState constants", () => {
  it("WRAPPER_CLASSES is a string", () => {
    expect(typeof WRAPPER_CLASSES).toBe("string");
    expect(WRAPPER_CLASSES).toContain("flex");
  });

  it("ICON_CLASSES contains text-text-tertiary", () => {
    expect(ICON_CLASSES).toContain("text-text-tertiary");
  });

  it("TITLE_CLASSES contains font-semibold", () => {
    expect(TITLE_CLASSES).toContain("font-semibold");
  });

  it("DESCRIPTION_CLASSES contains text-text-secondary", () => {
    expect(DESCRIPTION_CLASSES).toContain("text-text-secondary");
  });

  it("ACTIONS_CLASSES contains gap-3", () => {
    expect(ACTIONS_CLASSES).toContain("gap-3");
  });
});
