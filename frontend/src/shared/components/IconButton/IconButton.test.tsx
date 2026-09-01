/**
 * IconButton — Unit Tests
 *
 * Covers: rendering, shapes, variants, sizes, loading, disabled,
 * ARIA, keyboard, click, ref forwarding, className merging.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import userEvent from "@testing-library/user-event";
import { X, Pencil, Plus } from "lucide-react";
import { IconButton } from "./IconButton";

// ── Rendering ────────────────────────────────────────────────────

describe("IconButton", () => {
  it("renders the icon child", () => {
    render(
      <IconButton aria-label="Close">
        <X data-testid="icon" />
      </IconButton>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders as a button with type=button by default", () => {
    render(
      <IconButton aria-label="Add">
        <Plus />
      </IconButton>,
    );
    const btn = screen.getByRole("button", { name: "Add" });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("type", "button");
  });

  it("forwards ref to the underlying button element", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(
      <IconButton ref={ref} aria-label="Edit">
        <Pencil />
      </IconButton>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  // ── Shapes ─────────────────────────────────────────────────

  describe("shapes", () => {
    it("applies rounded-full for circle shape (default)", () => {
      render(
        <IconButton aria-label="Close">
          <X />
        </IconButton>,
      );
      expect(screen.getByRole("button").className).toContain("rounded-full");
    });

    it("applies rounded-button for square shape", () => {
      render(
        <IconButton shape="square" aria-label="Close">
          <X />
        </IconButton>,
      );
      expect(screen.getByRole("button").className).toContain("rounded-button");
    });
  });

  // ── Variants ───────────────────────────────────────────────

  describe("variants", () => {
    it("applies filled variant classes by default", () => {
      render(
        <IconButton aria-label="Add">
          <Plus />
        </IconButton>,
      );
      const btn = screen.getByRole("button");
      expect(btn.className).toContain("bg-brand-primary");
      expect(btn.className).toContain("text-text-inverse");
    });

    it("applies ghost variant classes", () => {
      render(
        <IconButton variant="ghost" aria-label="Close">
          <X />
        </IconButton>,
      );
      const btn = screen.getByRole("button");
      expect(btn.className).toContain("bg-transparent");
      expect(btn.className).toContain("text-text-secondary");
    });

    it("applies outline variant classes", () => {
      render(
        <IconButton variant="outline" aria-label="Edit">
          <Pencil />
        </IconButton>,
      );
      const btn = screen.getByRole("button");
      expect(btn.className).toContain("border-brand-primary");
      expect(btn.className).toContain("bg-transparent");
    });
  });

  // ── Sizes ──────────────────────────────────────────────────

  describe("sizes", () => {
    const sizeCases: [string, string][] = [
      ["xs", "h-7 w-7"],
      ["sm", "h-8 w-8"],
      ["md", "h-10 w-10"],
      ["lg", "h-11 w-11"],
      ["xl", "h-12 w-12"],
    ];

    it.each(sizeCases)("applies %s size classes", (size, expectedClasses) => {
      render(
        <IconButton size={size as never} aria-label="Test">
          <Plus />
        </IconButton>,
      );
      const btn = screen.getByRole("button");
      for (const cls of expectedClasses.split(" ")) {
        expect(btn.className).toContain(cls);
      }
    });
  });

  // ── Loading ────────────────────────────────────────────────

  describe("loading", () => {
    it("shows a spinner when isLoading", () => {
      render(
        <IconButton isLoading aria-label="Saving">
          <Plus />
        </IconButton>,
      );
      expect(screen.getByRole("button").querySelector(".animate-spin")).toBeInTheDocument();
    });

    it("sets aria-busy when isLoading", () => {
      render(
        <IconButton isLoading aria-label="Saving">
          <Plus />
        </IconButton>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    });

    it("adds cursor-wait when isLoading", () => {
      render(
        <IconButton isLoading aria-label="Saving">
          <Plus />
        </IconButton>,
      );
      expect(screen.getByRole("button").className).toContain("cursor-wait");
    });
  });

  // ── Disabled ───────────────────────────────────────────────

  describe("disabled", () => {
    it("disables the button when isDisabled", () => {
      render(
        <IconButton isDisabled aria-label="Disabled">
          <Plus />
        </IconButton>,
      );
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("sets aria-disabled when isDisabled", () => {
      render(
        <IconButton isDisabled aria-label="Disabled">
          <Plus />
        </IconButton>,
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-disabled", "true");
    });

    it("disables when isLoading", () => {
      render(
        <IconButton isLoading aria-label="Loading">
          <Plus />
        </IconButton>,
      );
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("adds opacity-50 when disabled", () => {
      render(
        <IconButton isDisabled aria-label="Disabled">
          <Plus />
        </IconButton>,
      );
      expect(screen.getByRole("button").className).toContain("opacity-50");
    });

    it("disables native disabled attribute when disabled prop is set", () => {
      render(
        <IconButton disabled aria-label="Disabled">
          <Plus />
        </IconButton>,
      );
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  // ── Click ──────────────────────────────────────────────────

  describe("click", () => {
    it("calls onClick when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <IconButton onClick={handleClick} aria-label="Click me">
          <Plus />
        </IconButton>,
      );
      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when isDisabled", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <IconButton isDisabled onClick={handleClick} aria-label="Disabled">
          <Plus />
        </IconButton>,
      );
      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("does not call onClick when isLoading", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <IconButton isLoading onClick={handleClick} aria-label="Loading">
          <Plus />
        </IconButton>,
      );
      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // ── Keyboard ───────────────────────────────────────────────

  describe("keyboard", () => {
    it("is focusable via Tab", async () => {
      const user = userEvent.setup();
      render(
        <IconButton aria-label="Focusable">
          <Plus />
        </IconButton>,
      );
      await user.tab();
      expect(screen.getByRole("button")).toHaveFocus();
    });

    it("activates on Enter", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <IconButton onClick={handleClick} aria-label="Enter test">
          <Plus />
        </IconButton>,
      );
      screen.getByRole("button").focus();
      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("activates on Space", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <IconButton onClick={handleClick} aria-label="Space test">
          <Plus />
        </IconButton>,
      );
      screen.getByRole("button").focus();
      await user.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // ── ARIA ───────────────────────────────────────────────────

  describe("aria", () => {
    it("requires aria-label (renders it)", () => {
      render(
        <IconButton aria-label="Close menu">
          <X />
        </IconButton>,
      );
      expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();
    });
  });

  // ── Custom className ───────────────────────────────────────

  it("merges custom className", () => {
    render(
      <IconButton className="custom-class" aria-label="Test">
        <Plus />
      </IconButton>,
    );
    expect(screen.getByRole("button").className).toContain("custom-class");
  });

  // ── Type override ──────────────────────────────────────────

  it("allows overriding type to submit", () => {
    render(
      <IconButton type="submit" aria-label="Submit">
        <Plus />
      </IconButton>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
