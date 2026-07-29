import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "./SearchInput";

// ── Mock: useReducedMotion ───────────────────────────────────────

vi.mock("@/shared/motion", () => ({
  useReducedMotion: () => false,
  duration: { normal: 400, slow: 500, slowest: 800 },
  easing: { out: [0, 0, 0.2, 1], "in-out": [0.4, 0, 0.2, 1] },
}));

// ── Helpers ──────────────────────────────────────────────────────

function getInput(): HTMLInputElement {
  return screen.getByRole("searchbox");
}

// ── Rendering ────────────────────────────────────────────────────

describe("SearchInput", () => {
  it("renders without crashing", () => {
    render(<SearchInput />);
    expect(getInput()).toBeTruthy();
  });

  it("renders as search type", () => {
    render(<SearchInput />);
    expect(getInput().type).toBe("search");
  });

  it("has default placeholder", () => {
    render(<SearchInput />);
    expect(getInput()).toHaveAttribute("placeholder", "Search\u2026");
  });

  it("accepts custom placeholder", () => {
    render(<SearchInput placeholder="Find transactions…" />);
    expect(getInput()).toHaveAttribute("placeholder", "Find transactions\u2026");
  });

  it("forwards ref to the native input", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<SearchInput ref={ref} />);
    expect(ref.current).toBeTruthy();
    expect(ref.current!.tagName).toBe("INPUT");
    expect(ref.current!.type).toBe("search");
  });

  // ── Search Icon ─────────────────────────────────────────────

  describe("search icon", () => {
    it("renders a magnifying glass icon", () => {
      const { container } = render(<SearchInput />);
      const svg = container.querySelector("svg[aria-hidden='true']");
      expect(svg).toBeTruthy();
    });

    it("search icon is aria-hidden", () => {
      const { container } = render(<SearchInput />);
      const svgs = container.querySelectorAll("svg");
      const hiddenSvgs = Array.from(svgs).filter(
        (s) => s.getAttribute("aria-hidden") === "true",
      );
      expect(hiddenSvgs.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── onSearch Callback ───────────────────────────────────────

  describe("onSearch", () => {
    it("called on Enter with current value", async () => {
      const onSearch = vi.fn();
      render(<SearchInput onSearch={onSearch} />);
      await userEvent.type(getInput(), "hello");
      fireEvent.keyDown(getInput(), { key: "Enter" });
      expect(onSearch).toHaveBeenCalledWith("hello");
    });

    it("not called on other keys", async () => {
      const onSearch = vi.fn();
      render(<SearchInput onSearch={onSearch} />);
      await userEvent.type(getInput(), "abc");
      expect(onSearch).not.toHaveBeenCalled();
    });

    it("called with empty string on clear", async () => {
      const onSearch = vi.fn();
      render(<SearchInput onSearch={onSearch} />);
      await userEvent.type(getInput(), "query");
      await userEvent.click(screen.getByLabelText("Clear input"));
      expect(onSearch).toHaveBeenCalledWith("");
    });

    it("called on Enter with empty string when input is empty", () => {
      const onSearch = vi.fn();
      render(<SearchInput onSearch={onSearch} />);
      fireEvent.keyDown(getInput(), { key: "Enter" });
      expect(onSearch).toHaveBeenCalledWith("");
    });
  });

  // ── Keyboard Shortcut Hint ─────────────────────────────────

  describe("search shortcut", () => {
    it("renders shortcut badge when searchShortcut provided", () => {
      render(<SearchInput searchShortcut="⌘K" />);
      expect(screen.getByText("⌘K")).toBeTruthy();
    });

    it("badge not rendered when searchShortcut not provided", () => {
      render(<SearchInput />);
      expect(screen.queryByRole("button", { name: /⌘K/ })).toBeNull();
    });

    it("badge contains the shortcut text", () => {
      render(<SearchInput searchShortcut="Ctrl+K" />);
      expect(screen.getByText("Ctrl+K")).toBeTruthy();
    });

    it("badge is a kbd element", () => {
      render(<SearchInput searchShortcut="⌘K" />);
      const kbd = screen.getByText("⌘K");
      expect(kbd.tagName).toBe("KBD");
    });
  });

  // ── Clearable ───────────────────────────────────────────────

  describe("clearable", () => {
    it("shows clear button when input has value", async () => {
      render(<SearchInput />);
      await userEvent.type(getInput(), "test");
      expect(screen.getByLabelText("Clear input")).toBeTruthy();
    });

    it("clear button not visible when empty", () => {
      render(<SearchInput />);
      expect(screen.queryByLabelText("Clear input")).toBeNull();
    });

    it("clear button has tabIndex=-1", async () => {
      render(<SearchInput />);
      await userEvent.type(getInput(), "test");
      expect(screen.getByLabelText("Clear input")).toHaveAttribute(
        "tabindex",
        "-1",
      );
    });

    it("clear button has hover animation classes", async () => {
      render(<SearchInput />);
      await userEvent.type(getInput(), "test");
      const clearBtn = screen.getByLabelText("Clear input");
      expect(clearBtn.className).toContain("transition-colors");
    });
  });

  // ── Loading ─────────────────────────────────────────────────

  describe("loading", () => {
    it("delegates loading to Input", () => {
      render(<SearchInput loading />);
      expect(screen.getByLabelText("Loading")).toBeTruthy();
    });
  });

  // ── Disabled ────────────────────────────────────────────────

  describe("disabled", () => {
    it("disables the input", () => {
      render(<SearchInput disabled />);
      expect(getInput()).toBeDisabled();
    });

    it("applies disabled classes", () => {
      const { container } = render(<SearchInput disabled />);
      expect(container.querySelector(".opacity-50")).toBeTruthy();
    });
  });

  // ── ARIA ────────────────────────────────────────────────────

  describe("accessibility", () => {
    it("has default aria-label=Search", () => {
      render(<SearchInput />);
      expect(getInput()).toHaveAttribute("aria-label", "Search");
    });

    it("custom aria-label overrides default", () => {
      render(<SearchInput aria-label="Find transactions" />);
      expect(getInput()).toHaveAttribute("aria-label", "Find transactions");
    });

    it("label links to input when label prop provided", () => {
      render(<SearchInput label="Search users" />);
      const label = screen.getByText("Search users");
      expect(label).toHaveAttribute("for", getInput().id);
    });
  });

  // ── Input Delegation ────────────────────────────────────────

  describe("delegates to Input", () => {
    it("passes errorText", () => {
      render(<SearchInput errorText="Too many results" />);
      expect(screen.getByText("Too many results")).toBeTruthy();
    });

    it("passes helperText", () => {
      render(<SearchInput helperText="Type to search" />);
      expect(screen.getByText("Type to search")).toBeTruthy();
    });

    it("passes size prop", () => {
      const { container } = render(<SearchInput size="lg" />);
      expect(container.querySelector(".h-12")).toBeTruthy();
    });

    it("passes state prop", () => {
      const { container } = render(<SearchInput state="success" />);
      expect(container.querySelector(".border-success")).toBeTruthy();
    });

    it("passes prefix", () => {
      render(<SearchInput prefix="$" />);
      expect(screen.getByText("$")).toBeTruthy();
    });

    it("merges custom className to outer wrapper", () => {
      const { container } = render(<SearchInput className="my-class" />);
      expect(container.firstElementChild!.className).toContain("my-class");
    });
  });

  // ── Keyboard Interaction ────────────────────────────────────

  describe("keyboard interaction", () => {
    it("forwards onKeyDown to consumer", () => {
      const onKeyDown = vi.fn();
      render(<SearchInput onKeyDown={onKeyDown} />);
      fireEvent.keyDown(getInput(), { key: "a" });
      expect(onKeyDown).toHaveBeenCalled();
    });

    it("forwards onChange to consumer", async () => {
      const onChange = vi.fn();
      render(<SearchInput onChange={onChange} />);
      await userEvent.type(getInput(), "a");
      expect(onChange).toHaveBeenCalled();
    });
  });

  // ── debounceMs ──────────────────────────────────────────────

  describe("debounceMs", () => {
    it("accepts debounceMs prop without error", () => {
      render(<SearchInput debounceMs={300} />);
      expect(getInput()).toBeTruthy();
    });
  });

  // ── autoFocus ───────────────────────────────────────────────

  describe("autoFocus", () => {
    it("accepts autoFocus prop", () => {
      render(<SearchInput autoFocus />);
      expect(document.activeElement).toBe(getInput());
    });
  });
});
