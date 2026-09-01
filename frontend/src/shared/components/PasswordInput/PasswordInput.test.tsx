import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import userEvent from "@testing-library/user-event";
import { PasswordInput } from "./PasswordInput";

// ── Mock: useReducedMotion ───────────────────────────────────────

vi.mock("@/shared/motion", () => ({
  useReducedMotion: () => false,
  duration: { normal: 400, slow: 500, slowest: 800 },
  easing: { out: [0, 0, 0.2, 1], "in-out": [0.4, 0, 0.2, 1] },
}));

// ── Helper: get native input ─────────────────────────────────────

function getInput(): HTMLInputElement {
  return document.querySelector("input")!;
}

// ── Caps Lock mock helper ────────────────────────────────────────

let capsLockReturnValue = false;
let originalGetModifierState: ((key: string) => boolean) | undefined;

beforeEach(() => {
  vi.restoreAllMocks();
  capsLockReturnValue = false;
  originalGetModifierState = KeyboardEvent.prototype.getModifierState;
  KeyboardEvent.prototype.getModifierState = function (key: string) {
    if (key === "CapsLock") return capsLockReturnValue;
    return originalGetModifierState!.call(this, key);
  };
});

afterEach(() => {
  if (originalGetModifierState) {
    KeyboardEvent.prototype.getModifierState = originalGetModifierState;
  }
});

function fireCapsLockOn() {
  capsLockReturnValue = true;
  fireEvent.keyDown(getInput(), { key: "a" });
}

function fireCapsLockOff() {
  capsLockReturnValue = false;
  fireEvent.keyUp(getInput(), { key: "a" });
}

// ── Rendering ────────────────────────────────────────────────────

describe("PasswordInput", () => {
  it("renders without crashing", () => {
    render(<PasswordInput />);
    expect(getInput()).toBeTruthy();
  });

  it("renders as password type by default", () => {
    render(<PasswordInput />);
    expect(getInput().type).toBe("password");
  });

  it("forwards ref to the native input", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<PasswordInput ref={ref} />);
    expect(ref.current).toBeTruthy();
    expect(ref.current!.tagName).toBe("INPUT");
    expect(ref.current!.type).toBe("password");
  });

  // ── Visibility Toggle ───────────────────────────────────────

  describe("visibility toggle", () => {
    it("renders show/hide toggle button", () => {
      render(<PasswordInput />);
      expect(screen.getByLabelText("Show password")).toBeTruthy();
    });

    it("toggles to text type when clicked", async () => {
      render(<PasswordInput />);
      await userEvent.click(screen.getByLabelText("Show password"));
      expect(getInput().type).toBe("text");
    });

    it("toggles back to password type on second click", async () => {
      render(<PasswordInput />);
      await userEvent.click(screen.getByLabelText("Show password"));
      await userEvent.click(screen.getByLabelText("Hide password"));
      expect(getInput().type).toBe("password");
    });

    it("aria-label changes to Hide password when visible", async () => {
      render(<PasswordInput />);
      await userEvent.click(screen.getByLabelText("Show password"));
      expect(screen.getByLabelText("Hide password")).toBeTruthy();
    });

    it("toggle button is not in tab order (tabIndex=-1)", () => {
      render(<PasswordInput />);
      expect(screen.getByLabelText("Show password")).toHaveAttribute(
        "tabindex",
        "-1",
      );
    });

    it("toggle hidden when loading", () => {
      render(<PasswordInput loading />);
      expect(screen.queryByLabelText("Show password")).toBeNull();
    });

    it("toggle hidden when disabled", () => {
      render(<PasswordInput disabled />);
      expect(screen.queryByLabelText("Show password")).toBeNull();
    });
  });

  // ── Autocomplete ────────────────────────────────────────────

  describe("autocomplete", () => {
    it("defaults to current-password", () => {
      render(<PasswordInput />);
      expect(getInput()).toHaveAttribute("autocomplete", "current-password");
    });

    it("accepts new-password", () => {
      render(<PasswordInput autoComplete="new-password" />);
      expect(getInput()).toHaveAttribute("autocomplete", "new-password");
    });
  });

  // ── Caps Lock Detection ─────────────────────────────────────

  describe("caps lock", () => {
    it("shows warning when Caps Lock is detected", () => {
      render(<PasswordInput />);
      fireCapsLockOn();
      expect(screen.getByText("Caps Lock is on")).toBeTruthy();
    });

    it("hides warning when Caps Lock is off", () => {
      render(<PasswordInput />);
      fireCapsLockOn();
      expect(screen.getByText("Caps Lock is on")).toBeTruthy();
      fireCapsLockOff();
      expect(screen.queryByText("Caps Lock is on")).toBeNull();
    });

    it("calls onCapsLockChange callback", () => {
      const onCapsLockChange = vi.fn();
      render(<PasswordInput onCapsLockChange={onCapsLockChange} />);
      fireCapsLockOn();
      expect(onCapsLockChange).toHaveBeenCalledWith(true);
      fireCapsLockOff();
      expect(onCapsLockChange).toHaveBeenCalledWith(false);
    });

    it("caps lock warning has role=status", () => {
      render(<PasswordInput />);
      fireCapsLockOn();
      expect(screen.getByRole("status")).toBeTruthy();
    });

    it("caps lock warning has aria-live=polite", () => {
      render(<PasswordInput />);
      fireCapsLockOn();
      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-live",
        "polite",
      );
    });

    it("caps lock id is added to aria-describedby", () => {
      render(<PasswordInput />);
      fireCapsLockOn();
      const describedBy = getInput().getAttribute("aria-describedby") ?? "";
      expect(describedBy).toContain("capslock");
    });

    it("caps lock warning hidden when disabled", () => {
      render(<PasswordInput disabled />);
      fireCapsLockOn();
      expect(screen.queryByText("Caps Lock is on")).toBeNull();
    });

    it("does not duplicate caps lock id in aria-describedby", () => {
      render(<PasswordInput helperText="Min 8 chars" />);
      fireCapsLockOn();
      const describedBy = getInput().getAttribute("aria-describedby") ?? "";
      const parts = describedBy.split(" ");
      expect(new Set(parts).size).toBe(parts.length);
    });
  });

  // ── Security Restrictions ───────────────────────────────────

  describe("security restrictions", () => {
    it("disablePaste prevents paste", () => {
      render(<PasswordInput disablePaste />);
      const input = getInput();
      const event = new Event("paste", { bubbles: true, cancelable: true });
      const preventDefault = vi.spyOn(event, "preventDefault");
      Object.defineProperty(event, "target", { value: input });
      fireEvent(input, event);
      expect(preventDefault).toHaveBeenCalled();
    });

    it("disableCopy prevents copy", () => {
      render(<PasswordInput disableCopy />);
      const input = getInput();
      const event = new Event("copy", { bubbles: true, cancelable: true });
      const preventDefault = vi.spyOn(event, "preventDefault");
      Object.defineProperty(event, "target", { value: input });
      fireEvent(input, event);
      expect(preventDefault).toHaveBeenCalled();
    });

    it("disableCut prevents cut", () => {
      render(<PasswordInput disableCut />);
      const input = getInput();
      const event = new Event("cut", { bubbles: true, cancelable: true });
      const preventDefault = vi.spyOn(event, "preventDefault");
      Object.defineProperty(event, "target", { value: input });
      fireEvent(input, event);
      expect(preventDefault).toHaveBeenCalled();
    });

    it("disableContextMenu prevents context menu", () => {
      render(<PasswordInput disableContextMenu />);
      const input = getInput();
      const event = new Event("contextmenu", {
        bubbles: true,
        cancelable: true,
      });
      const preventDefault = vi.spyOn(event, "preventDefault");
      Object.defineProperty(event, "target", { value: input });
      fireEvent(input, event);
      expect(preventDefault).toHaveBeenCalled();
    });

    it("paste is allowed by default", () => {
      const onPaste = vi.fn();
      render(<PasswordInput onPaste={onPaste} />);
      const input = getInput();
      const event = new Event("paste", { bubbles: true, cancelable: true });
      Object.defineProperty(event, "target", { value: input });
      fireEvent(input, event);
      expect(onPaste).toHaveBeenCalled();
    });
  });

  // ── Strength Slot ───────────────────────────────────────────

  describe("strength indicator", () => {
    it("renders strength indicator when provided", () => {
      render(
        <PasswordInput
          strengthIndicator={<div data-testid="strength">Strong</div>}
        />,
      );
      expect(screen.getByTestId("strength")).toBeTruthy();
      expect(screen.getByText("Strong")).toBeTruthy();
    });

    it("does not render strength area when not provided", () => {
      const { container } = render(<PasswordInput />);
      const strengthArea = container.querySelector("[class*='mt-1.5']");
      expect(strengthArea).toBeNull();
    });

    it("renders complex ReactNode in strength slot", () => {
      render(
        <PasswordInput
          strengthIndicator={
            <div>
              <div data-testid="bar" />
              <span>80% strong</span>
            </div>
          }
        />,
      );
      expect(screen.getByTestId("bar")).toBeTruthy();
      expect(screen.getByText("80% strong")).toBeTruthy();
    });
  });

  // ── Disabled / Loading ──────────────────────────────────────

  describe("disabled", () => {
    it("disables the input", () => {
      render(<PasswordInput disabled />);
      expect(getInput()).toBeDisabled();
    });

    it("hides toggle when disabled", () => {
      render(<PasswordInput disabled />);
      expect(screen.queryByLabelText("Show password")).toBeNull();
    });
  });

  describe("loading", () => {
    it("shows loading spinner via Input", () => {
      render(<PasswordInput loading />);
      expect(screen.getByLabelText("Loading")).toBeTruthy();
    });

    it("hides toggle when loading", () => {
      render(<PasswordInput loading />);
      expect(screen.queryByLabelText("Show password")).toBeNull();
    });
  });

  // ── Accessibility ───────────────────────────────────────────

  describe("accessibility", () => {
    it("has proper autocomplete for login", () => {
      render(<PasswordInput autoComplete="current-password" />);
      expect(getInput()).toHaveAttribute("autocomplete", "current-password");
    });

    it("has proper autocomplete for registration", () => {
      render(<PasswordInput autoComplete="new-password" />);
      expect(getInput()).toHaveAttribute("autocomplete", "new-password");
    });

    it("label links to input", () => {
      render(<PasswordInput label="Password" />);
      const label = screen.getByText("Password");
      expect(label).toHaveAttribute("for", getInput().id);
    });

    it("required shows asterisk", () => {
      render(<PasswordInput label="Password" required />);
      expect(screen.getByText("*")).toBeTruthy();
    });

    it("error state sets aria-invalid", () => {
      render(<PasswordInput errorText="Too short" />);
      expect(getInput()).toHaveAttribute("aria-invalid", "true");
    });

    it("toggle button has descriptive aria-label", async () => {
      render(<PasswordInput />);
      expect(screen.getByLabelText("Show password")).toBeTruthy();
      await userEvent.click(screen.getByLabelText("Show password"));
      expect(screen.getByLabelText("Hide password")).toBeTruthy();
    });
  });

  // ── Delegates to Input ──────────────────────────────────────

  describe("delegates to Input", () => {
    it("passes size prop", () => {
      const { container } = render(<PasswordInput size="lg" />);
      expect(container.querySelector(".h-12")).toBeTruthy();
    });

    it("passes state prop", () => {
      const { container } = render(<PasswordInput state="success" />);
      expect(container.querySelector(".border-success")).toBeTruthy();
    });

    it("passes errorText", () => {
      render(<PasswordInput errorText="Required" />);
      expect(screen.getByText("Required")).toBeTruthy();
    });

    it("passes helperText", () => {
      render(<PasswordInput helperText="Min 8 characters" />);
      expect(screen.getByText("Min 8 characters")).toBeTruthy();
    });

    it("passes prefix", () => {
      render(<PasswordInput prefix="$" />);
      expect(screen.getByText("$")).toBeTruthy();
    });
  });

  // ── Custom className ────────────────────────────────────────

  describe("className", () => {
    it("applies custom className to outer wrapper", () => {
      const { container } = render(<PasswordInput className="my-class" />);
      expect(container.firstElementChild!.className).toContain("my-class");
    });
  });

  // ── Keyboard Interaction ────────────────────────────────────

  describe("keyboard interaction", () => {
    it("forwards onKeyDown to consumer", () => {
      const onKeyDown = vi.fn();
      render(<PasswordInput onKeyDown={onKeyDown} />);
      fireEvent.keyDown(getInput(), { key: "Enter" });
      expect(onKeyDown).toHaveBeenCalled();
    });

    it("caps lock detection coexists with consumer onKeyDown", () => {
      const onKeyDown = vi.fn();
      render(<PasswordInput onKeyDown={onKeyDown} />);
      fireCapsLockOn();
      expect(onKeyDown).toHaveBeenCalled();
      expect(screen.getByText("Caps Lock is on")).toBeTruthy();
    });
  });
});
