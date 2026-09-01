/**
 * Badge — Unit Tests
 *
 * Covers: rendering, variants, shapes, sizes, financial status,
 * icons, dot indicator, clickable, link, ARIA, keyboard, className.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import userEvent from "@testing-library/user-event";
import { CheckCircle, AlertTriangle, X } from "lucide-react";
import { Badge } from "./Badge";

// ── Rendering ────────────────────────────────────────────────────

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders as a span by default", () => {
    render(<Badge>Test</Badge>);
    const el = screen.getByText("Test");
    expect(el.tagName).toBe("SPAN");
  });

  it("applies default variant (primary) and size (md)", () => {
    render(<Badge>Default</Badge>);
    const el = screen.getByText("Default");
    expect(el.className).toContain("bg-brand-primary-subtle");
    expect(el.className).toContain("h-7");
  });

  // ── Variants ─────────────────────────────────────────────────

  describe("variants", () => {
    const cases: [string, string][] = [
      ["primary", "bg-brand-primary-subtle"],
      ["success", "bg-success-subtle"],
      ["warning", "bg-warning-subtle"],
      ["danger", "bg-danger-subtle"],
      ["info", "bg-info-subtle"],
      ["neutral", "bg-bg-tertiary"],
      ["outline", "bg-transparent"],
      ["dot", "bg-bg-tertiary"],
    ];

    it.each(cases)("applies %s variant classes", (variant, expectedClass) => {
      render(<Badge variant={variant as never}>Test</Badge>);
      expect(screen.getByText("Test").className).toContain(expectedClass);
    });
  });

  // ── Financial Variant ────────────────────────────────────────

  describe("financial variant", () => {
    it("applies neutral bg by default", () => {
      render(
        <Badge variant="financial" financialStatus="credit">
          +$100
        </Badge>,
      );
      expect(screen.getByText("+$100").className).toContain("bg-bg-tertiary");
    });

    it("applies success text color for credit status", () => {
      render(
        <Badge variant="financial" financialStatus="credit">
          Credit
        </Badge>,
      );
      expect(screen.getByText("Credit").className).toContain("text-success");
    });

    it("applies danger text color for debit status", () => {
      render(
        <Badge variant="financial" financialStatus="debit">
          Debit
        </Badge>,
      );
      expect(screen.getByText("Debit").className).toContain("text-danger");
    });

    it("applies warning text color for pending status", () => {
      render(
        <Badge variant="financial" financialStatus="pending">
          Pending
        </Badge>,
      );
      expect(screen.getByText("Pending").className).toContain("text-warning");
    });

    it("applies held text color for held status", () => {
      render(
        <Badge variant="financial" financialStatus="held">
          Held
        </Badge>,
      );
      expect(screen.getByText("Held").className).toContain("text-held");
    });

    it("applies success text color for settled status", () => {
      render(
        <Badge variant="financial" financialStatus="settled">
          Settled
        </Badge>,
      );
      expect(screen.getByText("Settled").className).toContain("text-success");
    });
  });

  // ── Shapes ──────────────────────────────────────────────────

  describe("shapes", () => {
    it("applies rounded-md for rounded shape (default)", () => {
      render(<Badge>Test</Badge>);
      expect(screen.getByText("Test").className).toContain("rounded-md");
    });

    it("applies rounded-full for pill shape", () => {
      render(<Badge shape="pill">Test</Badge>);
      expect(screen.getByText("Test").className).toContain("rounded-full");
    });
  });

  // ── Sizes ──────────────────────────────────────────────────

  describe("sizes", () => {
    const sizeCases: [string, string][] = [
      ["xs", "h-5"],
      ["sm", "h-6"],
      ["md", "h-7"],
      ["lg", "h-8"],
    ];

    it.each(sizeCases)("applies %s size classes", (size, expectedHeight) => {
      render(<Badge size={size as never}>Test</Badge>);
      expect(screen.getByText("Test").className).toContain(expectedHeight);
    });
  });

  // ── Icons ──────────────────────────────────────────────────

  describe("icons", () => {
    it("renders leftIcon", () => {
      render(<Badge leftIcon={<CheckCircle data-testid="icon" />}>Verified</Badge>);
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("renders rightIcon", () => {
      render(<Badge rightIcon={<AlertTriangle data-testid="icon" />}>Warning</Badge>);
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("renders both icons", () => {
      render(
        <Badge leftIcon={<CheckCircle data-testid="left" />} rightIcon={<X data-testid="right" />}>
          Both
        </Badge>,
      );
      expect(screen.getByTestId("left")).toBeInTheDocument();
      expect(screen.getByTestId("right")).toBeInTheDocument();
    });
  });

  // ── Dot Indicator ──────────────────────────────────────────

  describe("dot", () => {
    it("renders a dot when showDot is true", () => {
      render(<Badge showDot>With dot</Badge>);
      const badge = screen.getByText("With dot").closest("span")!;
      const dot = badge.querySelector('[aria-hidden="true"]');
      expect(dot).toBeInTheDocument();
      expect(dot?.className).toContain("rounded-full");
    });

    it("does not render a dot by default", () => {
      render(<Badge>No dot</Badge>);
      const badge = screen.getByText("No dot").closest("span")!;
      const dots = badge.querySelectorAll('[aria-hidden="true"]');
      expect(dots.length).toBe(0);
    });

    it("applies correct dot color for success variant", () => {
      render(
        <Badge variant="success" showDot>
          Success
        </Badge>,
      );
      const badge = screen.getByText("Success").closest("span")!;
      const dot = badge.querySelector('[aria-hidden="true"]');
      expect(dot?.className).toContain("bg-success");
    });

    it("applies correct dot color for danger variant", () => {
      render(
        <Badge variant="danger" showDot>
          Danger
        </Badge>,
      );
      const badge = screen.getByText("Danger").closest("span")!;
      const dot = badge.querySelector('[aria-hidden="true"]');
      expect(dot?.className).toContain("bg-danger");
    });

    it("applies correct dot color for financial credit", () => {
      render(
        <Badge variant="financial" financialStatus="credit" showDot>
          Credit
        </Badge>,
      );
      const badge = screen.getByText("Credit").closest("span")!;
      const dot = badge.querySelector('[aria-hidden="true"]');
      expect(dot?.className).toContain("bg-success");
    });

    it("adds pl-1 padding when dot is shown", () => {
      render(<Badge showDot>With dot</Badge>);
      expect(screen.getByText("With dot").closest("span")!.className).toContain("pl-1");
    });
  });

  // ── Clickable ──────────────────────────────────────────────

  describe("clickable", () => {
    it("renders as a button when onClick is provided", () => {
      render(<Badge onClick={() => {}}>Click me</Badge>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("calls onClick when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Badge onClick={handleClick}>Click me</Badge>);
      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("adds cursor-pointer when clickable", () => {
      render(<Badge onClick={() => {}}>Click me</Badge>);
      expect(screen.getByRole("button").className).toContain("cursor-pointer");
    });

    it("is focusable via Tab when clickable", async () => {
      const user = userEvent.setup();
      render(<Badge onClick={() => {}}>Click me</Badge>);
      await user.tab();
      expect(screen.getByRole("button")).toHaveFocus();
    });

    it("activates on Enter when clickable", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Badge onClick={handleClick}>Click me</Badge>);
      screen.getByRole("button").focus();
      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("activates on Space when clickable", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Badge onClick={handleClick}>Click me</Badge>);
      screen.getByRole("button").focus();
      await user.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // ── Link ───────────────────────────────────────────────────

  describe("link", () => {
    it("renders as an anchor when href is provided", () => {
      render(<Badge href="/details">Details</Badge>);
      const link = screen.getByRole("link", { name: "Details" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/details");
    });

    it("applies focus-visible ring when link", () => {
      render(<Badge href="/details">Details</Badge>);
      expect(screen.getByRole("link").className).toContain("cursor-pointer");
    });
  });

  // ── Custom className ───────────────────────────────────────

  it("merges custom className", () => {
    render(<Badge className="custom-class">Test</Badge>);
    expect(screen.getByText("Test").closest("span")!.className).toContain("custom-class");
  });

  // ── Accessibility ──────────────────────────────────────────

  describe("accessibility", () => {
    it("icon-only dot is aria-hidden", () => {
      render(<Badge showDot>Test</Badge>);
      const badge = screen.getByText("Test").closest("span")!;
      const dot = badge.querySelector('[aria-hidden="true"]');
      expect(dot).toHaveAttribute("aria-hidden", "true");
    });

    it("icons are aria-hidden", () => {
      render(<Badge leftIcon={<CheckCircle data-testid="icon" />}>Test</Badge>);
      const badge = screen.getByText("Test").closest("span")!;
      const iconWrapper = badge.querySelector('[aria-hidden="true"]');
      expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
    });
  });
});
