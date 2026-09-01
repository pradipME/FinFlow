import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

beforeEach(() => {
  vi.restoreAllMocks();
});

// ── Rendering ────────────────────────────────────────────────────

describe("Input", () => {
  it("renders without crashing", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeTruthy();
  });

  it("renders with a generated id", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input.id).toBeTruthy();
  });

  it("uses provided id", () => {
    render(<Input id="my-field" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "my-field");
  });

  // ── Types ───────────────────────────────────────────────────

  describe("types", () => {
    it("text by default", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
    });

    it("email type", () => {
      render(<Input type="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
    });

    it("password type", () => {
      render(<Input type="password" />);
      const input = document.querySelector('input[type="password"]');
      expect(input).toHaveAttribute("type", "password");
    });

    it("number type", () => {
      render(<Input type="number" />);
      expect(screen.getByRole("spinbutton")).toHaveAttribute("type", "number");
    });

    it("tel type", () => {
      render(<Input type="tel" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "tel");
    });

    it("url type", () => {
      render(<Input type="url" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "url");
    });
  });

  // ── Sizes ───────────────────────────────────────────────────

  describe("sizes", () => {
    it("sm: applies h-8", () => {
      const { container } = render(<Input size="sm" />);
      const wrapper = container.querySelector(".relative");
      expect(wrapper!.className).toContain("h-8");
    });

    it("md: applies h-10", () => {
      const { container } = render(<Input size="md" />);
      const wrapper = container.querySelector(".relative");
      expect(wrapper!.className).toContain("h-10");
    });

    it("lg: applies h-12", () => {
      const { container } = render(<Input size="lg" />);
      const wrapper = container.querySelector(".relative");
      expect(wrapper!.className).toContain("h-12");
    });
  });

  // ── Label ───────────────────────────────────────────────────

  describe("label", () => {
    it("renders label text", () => {
      render(<Input label="Email" />);
      expect(screen.getByLabelText("Email")).toBeTruthy();
    });

    it("label links to input via htmlFor", () => {
      render(<Input label="Email" />);
      const label = screen.getByText("Email");
      const input = screen.getByRole("textbox");
      expect(label).toHaveAttribute("for", input.id);
    });

    it("shows required asterisk", () => {
      render(<Input label="Email" required />);
      const asterisk = screen.getByText("*");
      expect(asterisk).toBeTruthy();
      expect(asterisk.getAttribute("aria-hidden")).toBe("true");
    });

    it("no asterisk when not required", () => {
      render(<Input label="Email" />);
      expect(screen.queryByText("*")).toBeNull();
    });
  });

  // ── States ──────────────────────────────────────────────────

  describe("states", () => {
    it("default: applies border-border-default", () => {
      const { container } = render(<Input />);
      const wrapper = container.querySelector(".relative");
      expect(wrapper!.className).toContain("border-border-default");
    });

    it("invalid via errorText: applies border-danger", () => {
      const { container } = render(<Input errorText="Required" />);
      const wrapper = container.querySelector(".relative");
      expect(wrapper!.className).toContain("border-danger");
    });

    it("success via successText: applies border-success", () => {
      const { container } = render(<Input successText="Looks good" />);
      const wrapper = container.querySelector(".relative");
      expect(wrapper!.className).toContain("border-success");
    });

    it("invalid state prop: applies border-danger", () => {
      const { container } = render(<Input state="invalid" />);
      const wrapper = container.querySelector(".relative");
      expect(wrapper!.className).toContain("border-danger");
    });

    it("success state prop: applies border-success", () => {
      const { container } = render(<Input state="success" />);
      const wrapper = container.querySelector(".relative");
      expect(wrapper!.className).toContain("border-success");
    });
  });

  // ── Disabled / ReadOnly ─────────────────────────────────────

  describe("disabled", () => {
    it("disables the input", () => {
      render(<Input disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("applies disabled classes", () => {
      const { container } = render(<Input disabled />);
      const wrapper = container.querySelector(".relative");
      expect(wrapper!.className).toContain("opacity-50");
    });

    it("dims the label", () => {
      render(<Input label="Name" disabled />);
      const label = screen.getByText("Name");
      expect(label.className).toContain("opacity-50");
    });
  });

  describe("readOnly", () => {
    it("makes input readonly", () => {
      render(<Input readOnly />);
      expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
    });

    it("applies readonly classes", () => {
      const { container } = render(<Input readOnly />);
      const wrapper = container.querySelector(".relative");
      expect(wrapper!.className).toContain("bg-surface-secondary");
    });
  });

  // ── Prefix / Suffix ─────────────────────────────────────────

  describe("prefix", () => {
    it("renders string prefix", () => {
      render(<Input prefix="$" />);
      expect(screen.getByText("$")).toBeTruthy();
    });

    it("renders element prefix", () => {
      render(<Input prefix={<span data-testid="pfx">$</span>} />);
      expect(screen.getByTestId("pfx")).toBeTruthy();
    });
  });

  describe("suffix", () => {
    it("renders string suffix", () => {
      render(<Input suffix=".00" />);
      expect(screen.getByText(".00")).toBeTruthy();
    });

    it("renders element suffix", () => {
      render(<Input suffix={<span data-testid="sfx">USD</span>} />);
      expect(screen.getByTestId("sfx")).toBeTruthy();
    });
  });

  // ── Icons ───────────────────────────────────────────────────

  describe("leftIcon", () => {
    it("renders left icon", () => {
      render(<Input leftIcon={<span data-testid="icon">IC</span>} />);
      expect(screen.getByTestId("icon")).toBeTruthy();
    });

    it("icon has aria-hidden", () => {
      const { container } = render(<Input leftIcon={<span>IC</span>} />);
      const icon = container.querySelector("[aria-hidden='true']");
      expect(icon).toBeTruthy();
    });

    it("adds padding-left to wrapper", () => {
      const { container } = render(<Input leftIcon={<span>IC</span>} />);
      const wrapper = container.querySelector(".relative");
      expect(wrapper!.className).toContain("pl-10");
    });
  });

  describe("rightIcon", () => {
    it("renders right icon", () => {
      render(<Input rightIcon={<span data-testid="icon">IC</span>} />);
      expect(screen.getByTestId("icon")).toBeTruthy();
    });

    it("adds padding-right to wrapper", () => {
      const { container } = render(<Input rightIcon={<span>IC</span>} />);
      const wrapper = container.querySelector(".relative");
      expect(wrapper!.className).toContain("pr-10");
    });

    it("hides right icon when loading", () => {
      render(<Input rightIcon={<span data-testid="icon">IC</span>} loading />);
      expect(screen.queryByTestId("icon")).toBeNull();
    });
  });

  // ── Clear Button ────────────────────────────────────────────

  describe("clearable", () => {
    it("does not show clear when empty", () => {
      render(<Input clearable />);
      expect(screen.queryByLabelText("Clear input")).toBeNull();
    });

    it("shows clear when has value", () => {
      render(<Input clearable value="hello" />);
      expect(screen.getByLabelText("Clear input")).toBeTruthy();
    });

    it("calls onClear when clicked", async () => {
      const onClear = vi.fn();
      render(<Input clearable value="hello" onClear={onClear} />);
      await userEvent.click(screen.getByLabelText("Clear input"));
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it("re-focuses input after clearing", () => {
      const onClear = vi.fn();
      render(<Input clearable value="hello" onClear={onClear} />);
      fireEvent.click(screen.getByLabelText("Clear input"));
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it("clears internal value when uncontrolled", () => {
      render(<Input clearable defaultValue="hello" />);
      fireEvent.click(screen.getByLabelText("Clear input"));
      expect(screen.getByRole("textbox")).toHaveValue("");
    });

    it("hides clear when loading", () => {
      render(<Input clearable value="hello" loading />);
      expect(screen.queryByLabelText("Clear input")).toBeNull();
    });
  });

  // ── Loading ─────────────────────────────────────────────────

  describe("loading", () => {
    it("shows loading spinner", () => {
      render(<Input loading />);
      expect(screen.getByLabelText("Loading")).toBeTruthy();
    });

    it("spinner has animate-spin", () => {
      render(<Input loading />);
      const spinner = screen.getByLabelText("Loading");
      expect(spinner.querySelector(".animate-spin")).toBeTruthy();
    });
  });

  // ── Messages ────────────────────────────────────────────────

  describe("messages", () => {
    it("shows helperText", () => {
      render(<Input helperText="Enter your email" />);
      expect(screen.getByText("Enter your email")).toBeTruthy();
    });

    it("shows errorText", () => {
      render(<Input errorText="Invalid email" />);
      expect(screen.getByText("Invalid email")).toBeTruthy();
    });

    it("shows successText", () => {
      render(<Input successText="Email verified" />);
      expect(screen.getByText("Email verified")).toBeTruthy();
    });

    it("errorText has role=alert", () => {
      render(<Input errorText="Error" />);
      expect(screen.getByText("Error")).toHaveAttribute("role", "alert");
    });

    it("hides helperText when errorText is present", () => {
      render(<Input helperText="Help" errorText="Error" />);
      expect(screen.queryByText("Help")).toBeNull();
    });

    it("hides successText when errorText is present", () => {
      render(<Input successText="OK" errorText="Error" />);
      expect(screen.queryByText("OK")).toBeNull();
    });

    it("hides helperText when successText is present", () => {
      render(<Input helperText="Help" successText="OK" />);
      expect(screen.queryByText("Help")).toBeNull();
    });
  });

  // ── Accessibility ───────────────────────────────────────────

  describe("accessibility", () => {
    it("has aria-describedby linking to error", () => {
      render(<Input errorText="Required field" />);
      const input = screen.getByRole("textbox");
      const describedBy = input.getAttribute("aria-describedby");
      expect(describedBy).toBeTruthy();
      const errorEl = document.getElementById(describedBy!.split(" ")[0]);
      expect(errorEl?.textContent).toBe("Required field");
    });

    it("has aria-describedby linking to helper", () => {
      render(<Input helperText="Help text" />);
      const input = screen.getByRole("textbox");
      const describedBy = input.getAttribute("aria-describedby");
      expect(describedBy).toBeTruthy();
    });

    it("has aria-invalid when error", () => {
      render(<Input errorText="Bad" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("no aria-invalid when valid", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
    });

    it("has aria-required when required", () => {
      render(<Input required />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-required", "true");
    });

    it("clear button has aria-label", () => {
      render(<Input clearable value="test" />);
      expect(screen.getByLabelText("Clear input")).toBeTruthy();
    });
  });

  // ── Value Handling ──────────────────────────────────────────

  describe("value handling", () => {
    it("controlled: displays value prop", () => {
      render(<Input value="controlled" />);
      expect(screen.getByRole("textbox")).toHaveValue("controlled");
    });

    it("uncontrolled: displays defaultValue", () => {
      render(<Input defaultValue="default" />);
      expect(screen.getByRole("textbox")).toHaveValue("default");
    });

    it("uncontrolled: updates on change", async () => {
      render(<Input />);
      await userEvent.type(screen.getByRole("textbox"), "abc");
      expect(screen.getByRole("textbox")).toHaveValue("abc");
    });
  });

  // ── Escape to Clear ─────────────────────────────────────────

  describe("escape to clear", () => {
    it("clears on Escape when clearable and has value", () => {
      const onClear = vi.fn();
      render(<Input clearable value="hello" onClear={onClear} />);
      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { key: "Escape" });
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it("does not clear on Escape when not clearable", async () => {
      render(<Input defaultValue="hello" />);
      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { key: "Escape" });
      expect(input).toHaveValue("hello");
    });
  });

  // ── Custom className ────────────────────────────────────────

  describe("className", () => {
    it("merges custom className on wrapper", () => {
      const { container } = render(<Input className="my-class" />);
      const wrapper = container.firstElementChild!;
      expect(wrapper.className).toContain("my-class");
    });
  });

  // ── forwardRef ──────────────────────────────────────────────

  describe("forwardRef", () => {
    it("exposes the input element via ref", () => {
      const ref = { current: null as HTMLInputElement | null };
      render(<Input ref={ref} />);
      expect(ref.current).toBeTruthy();
      expect(ref.current!.tagName).toBe("INPUT");
    });
  });
});
