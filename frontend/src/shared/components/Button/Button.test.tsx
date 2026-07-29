/**
 * Button — Unit Tests
 *
 * Covers: rendering, variants, sizes, icons, loading, disabled,
 * full-width, keyboard accessibility, ARIA, ref forwarding, and click.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Save, ArrowRight } from "lucide-react";
import { Button } from "./Button";

// ── Rendering ────────────────────────────────────────────────────

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("renders with default variant (primary) and size (md)", () => {
    render(<Button>Default</Button>);
    const btn = screen.getByRole("button");
    // Should have primary-related classes
    expect(btn.className).toContain("bg-brand-primary");
    expect(btn.className).toContain("h-10");
  });

  it("forwards ref to the underlying button element", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  // ── Variants ─────────────────────────────────────────────────

  describe("variants", () => {
    const cases: [string, string][] = [
      ["primary", "bg-brand-primary"],
      ["secondary", "bg-bg-tertiary"],
      ["outline", "bg-transparent"],
      ["ghost", "bg-transparent"],
      ["danger", "bg-danger"],
      ["success", "bg-success"],
      ["glass", "bg-glass-bg"],
      ["gradient", "bg-gradient-primary"],
      ["link", "bg-transparent"],
    ];

    it.each(cases)("applies %s variant classes", (variant, expectedClass) => {
      render(<Button variant={variant as never}>Test</Button>);
      expect(screen.getByRole("button").className).toContain(expectedClass);
    });
  });

  // ── Sizes ────────────────────────────────────────────────────

  describe("sizes", () => {
    const sizeCases: [string, string][] = [
      ["xs", "h-7"],
      ["sm", "h-8"],
      ["md", "h-10"],
      ["lg", "h-11"],
      ["xl", "h-12"],
    ];

    it.each(sizeCases)("applies %s size classes", (size, expectedHeight) => {
      render(<Button size={size as never}>Test</Button>);
      expect(screen.getByRole("button").className).toContain(expectedHeight);
    });
  });

  // ── Icons ────────────────────────────────────────────────────

  describe("icons", () => {
    it("renders leftIcon", () => {
      render(<Button leftIcon={<Save data-testid="icon" />}>Save</Button>);
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("renders rightIcon", () => {
      render(<Button rightIcon={<ArrowRight data-testid="icon" />}>Next</Button>);
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("renders both leftIcon and rightIcon", () => {
      render(
        <Button
          leftIcon={<Save data-testid="left" />}
          rightIcon={<ArrowRight data-testid="right" />}
        >
          Both
        </Button>,
      );
      expect(screen.getByTestId("left")).toBeInTheDocument();
      expect(screen.getByTestId("right")).toBeInTheDocument();
    });
  });

  // ── Loading ──────────────────────────────────────────────────

  describe("loading", () => {
    it("shows spinner instead of leftIcon when isLoading", () => {
      render(
        <Button isLoading leftIcon={<Save data-testid="icon" />}>
          Saving
        </Button>,
      );
      expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
      // The spinner (Loader2) renders an SVG with class animate-spin
      expect(screen.getByRole("button").querySelector(".animate-spin")).toBeInTheDocument();
    });

    it("sets aria-busy to true when isLoading", () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    });

    it("adds cursor-wait class when isLoading", () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole("button").className).toContain("cursor-wait");
    });

    it("hides rightIcon when isLoading", () => {
      render(
        <Button isLoading rightIcon={<ArrowRight data-testid="icon" />}>
          Loading
        </Button>,
      );
      expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
    });
  });

  // ── Disabled ─────────────────────────────────────────────────

  describe("disabled", () => {
    it("disables the button when isDisabled is true", () => {
      render(<Button isDisabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("sets aria-disabled when isDisabled", () => {
      render(<Button isDisabled>Disabled</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("aria-disabled", "true");
    });

    it("disables when isLoading", () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("adds opacity-50 class when disabled", () => {
      render(<Button isDisabled>Disabled</Button>);
      expect(screen.getByRole("button").className).toContain("opacity-50");
    });
  });

  // ── Full Width ───────────────────────────────────────────────

  describe("fullWidth", () => {
    it("adds w-full class when fullWidth", () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole("button").className).toContain("w-full");
    });
  });

  // ── Icon Only ────────────────────────────────────────────────

  describe("iconOnly", () => {
    it("adds aspect-square when isIconOnly", () => {
      render(
        <Button isIconOnly aria-label="Save">
          <Save />
        </Button>,
      );
      expect(screen.getByRole("button").className).toContain("aspect-square");
    });
  });

  // ── Click ────────────────────────────────────────────────────

  describe("click", () => {
    it("calls onClick when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button isDisabled onClick={handleClick}>
          Disabled
        </Button>,
      );
      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("does not call onClick when isLoading", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button isLoading onClick={handleClick}>
          Loading
        </Button>,
      );
      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // ── Keyboard ─────────────────────────────────────────────────

  describe("keyboard", () => {
    it("is focusable via Tab", async () => {
      const user = userEvent.setup();
      render(<Button>Focus me</Button>);
      await user.tab();
      expect(screen.getByRole("button")).toHaveFocus();
    });

    it("activates on Enter", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Enter</Button>);
      screen.getByRole("button").focus();
      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("activates on Space", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Space</Button>);
      screen.getByRole("button").focus();
      await user.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // ── Custom className ─────────────────────────────────────────

  it("merges custom className", () => {
    render(<Button className="custom-class">Test</Button>);
    expect(screen.getByRole("button").className).toContain("custom-class");
  });

  // ── type attribute ───────────────────────────────────────────

  it("defaults to type=button", () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("allows overriding type", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
