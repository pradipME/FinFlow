import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OTPInput } from "./OTPInput";

// ── Mock: useReducedMotion ───────────────────────────────────────

vi.mock("@/shared/motion", () => ({
  useReducedMotion: () => false,
  duration: { normal: 400, slow: 500, slowest: 800 },
  easing: { out: [0, 0, 0.2, 1], "in-out": [0.4, 0, 0.2, 1] },
}));

// ── Helpers ──────────────────────────────────────────────────────

function getCells(): HTMLInputElement[] {
  return Array.from(document.querySelectorAll('input[aria-label^="Digit"]'));
}

function getHiddenInput(): HTMLInputElement {
  return document.querySelector('input[aria-hidden="true"]')!;
}

function getCell(index: number): HTMLInputElement {
  return getCells()[index];
}

// ── Rendering ────────────────────────────────────────────────────

describe("OTPInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<OTPInput />);
    expect(getCells().length).toBe(6);
  });

  it("renders 4 cells when length=4", () => {
    render(<OTPInput length={4} />);
    expect(getCells().length).toBe(4);
  });

  it("renders 6 cells when length=6", () => {
    render(<OTPInput length={6} />);
    expect(getCells().length).toBe(6);
  });

  it("each cell has inputMode=numeric", () => {
    render(<OTPInput />);
    getCells().forEach((cell) => {
      expect(cell).toHaveAttribute("inputmode", "numeric");
    });
  });

  it("each cell has pattern=[0-9]*", () => {
    render(<OTPInput />);
    getCells().forEach((cell) => {
      expect(cell).toHaveAttribute("pattern", "[0-9]*");
    });
  });

  it("each cell has maxLength=1", () => {
    render(<OTPInput />);
    getCells().forEach((cell) => {
      expect(cell).toHaveAttribute("maxlength", "1");
    });
  });

  it("each cell has autoComplete=one-time-code", () => {
    render(<OTPInput />);
    getCells().forEach((cell) => {
      expect(cell).toHaveAttribute("autocomplete", "one-time-code");
    });
  });

  it("has hidden input for form submission", () => {
    render(<OTPInput />);
    const hidden = getHiddenInput();
    expect(hidden).toBeTruthy();
    expect(hidden.type).toBe("text");
    expect(hidden.readOnly).toBe(true);
  });

  it("hidden input has name from aria-label", () => {
    render(<OTPInput />);
    expect(getHiddenInput().name).toBe("Verification code");
  });

  it("hidden input has custom aria-label name", () => {
    render(<OTPInput aria-label="SMS Code" />);
    expect(getHiddenInput().name).toBe("SMS Code");
  });

  // ── Label ─────────────────────────────────────────────────

  describe("label", () => {
    it("renders label when provided", () => {
      render(<OTPInput label="Enter code" />);
      expect(screen.getByText("Enter code")).toBeTruthy();
    });

    it("label has correct tag", () => {
      render(<OTPInput label="Enter code" />);
      expect(screen.getByText("Enter code").tagName).toBe("LABEL");
    });

    it("group has aria-labelledby when label provided", () => {
      render(<OTPInput label="Enter code" />);
      const group = screen.getByRole("group");
      expect(group).toHaveAttribute("aria-labelledby");
    });

    it("group has aria-label when no label", () => {
      render(<OTPInput />);
      const group = screen.getByRole("group");
      expect(group).toHaveAttribute("aria-label", "Verification code");
    });
  });

  // ── Auto-focus ────────────────────────────────────────────

  describe("autoFocus", () => {
    it("auto-focuses first cell by default", () => {
      render(<OTPInput autoFocus />);
      expect(getCell(0)).toBe(document.activeElement);
    });

    it("auto-focuses specific index when number", () => {
      render(<OTPInput autoFocus={2} />);
      expect(getCell(2)).toBe(document.activeElement);
    });

    it("no auto-focus when autoFocus=false", () => {
      render(<OTPInput autoFocus={false} />);
      expect(document.activeElement).not.toBe(getCell(0));
    });
  });

  // ── Typing ────────────────────────────────────────────────

  describe("typing", () => {
    it("accepts single digit", async () => {
      const onChange = vi.fn();
      render(<OTPInput onChange={onChange} autoFocus={false} />);
      await userEvent.type(getCell(0), "5");
      expect(getCell(0).value).toBe("5");
    });

    it("auto-advances to next cell on digit", async () => {
      render(<OTPInput autoFocus={false} />);
      await userEvent.type(getCell(0), "3");
      expect(document.activeElement).toBe(getCell(1));
    });

    it("only takes last digit on multi-char input", async () => {
      render(<OTPInput autoFocus={false} />);
      await userEvent.type(getCell(0), "abc5");
      expect(getCell(0).value).toBe("5");
    });

    it("fires onChange with accumulated digits", async () => {
      const onChange = vi.fn();
      render(<OTPInput onChange={onChange} autoFocus={false} />);
      await userEvent.type(getCell(0), "1");
      await userEvent.type(getCell(1), "2");
      expect(onChange).toHaveBeenCalledWith("1");
      expect(onChange).toHaveBeenCalledWith("12");
    });
  });

  // ── Paste ─────────────────────────────────────────────────

  describe("paste", () => {
    it("distributes pasted digits across cells", async () => {
      const onChange = vi.fn();
      render(<OTPInput onChange={onChange} autoFocus={false} />);
      const pastedData = { getData: () => "123456" };
      fireEvent.paste(getCell(0), {
        clipboardData: pastedData as unknown as DataTransfer,
      });
      expect(getHiddenInput().value).toBe("123456");
      getCells().forEach((cell, i) => {
        expect(cell.value).toBe(String(i + 1));
      });
    });

    it("truncates paste to length", async () => {
      render(<OTPInput length={4} />);
      const pastedData = { getData: () => "12345678" };
      fireEvent.paste(getCell(0), {
        clipboardData: pastedData as unknown as DataTransfer,
      });
      expect(getHiddenInput().value).toBe("1234");
    });

    it("strips non-digits from pasted text", async () => {
      render(<OTPInput />);
      const pastedData = { getData: () => "abc-123456" };
      fireEvent.paste(getCell(0), {
        clipboardData: pastedData as unknown as DataTransfer,
      });
      expect(getHiddenInput().value).toBe("123456");
    });

    it("focuses last filled cell after paste", async () => {
      render(<OTPInput />);
      const pastedData = { getData: () => "1234" };
      fireEvent.paste(getCell(0), {
        clipboardData: pastedData as unknown as DataTransfer,
      });
      expect(document.activeElement).toBe(getCell(3));
    });
  });

  // ── Keyboard Navigation ───────────────────────────────────

  describe("keyboard navigation", () => {
    it("ArrowRight moves to next cell", async () => {
      render(<OTPInput autoFocus={false} />);
      getCell(0).focus();
      fireEvent.keyDown(getCell(0), { key: "ArrowRight" });
      expect(document.activeElement).toBe(getCell(1));
    });

    it("ArrowLeft moves to previous cell", async () => {
      render(<OTPInput autoFocus={false} />);
      getCell(1).focus();
      fireEvent.keyDown(getCell(1), { key: "ArrowLeft" });
      expect(document.activeElement).toBe(getCell(0));
    });

    it("ArrowLeft on first cell stays at 0", () => {
      render(<OTPInput />);
      getCell(0).focus();
      fireEvent.keyDown(getCell(0), { key: "ArrowRight" });
      expect(document.activeElement).toBe(getCell(1));
    });

    it("Home moves to first cell", () => {
      render(<OTPInput />);
      getCell(4).focus();
      fireEvent.keyDown(getCell(4), { key: "Home" });
      expect(document.activeElement).toBe(getCell(0));
    });

    it("End moves to last cell", () => {
      render(<OTPInput />);
      getCell(0).focus();
      fireEvent.keyDown(getCell(0), { key: "End" });
      expect(document.activeElement).toBe(getCell(5));
    });

    it("Backspace clears current cell", async () => {
      const onChange = vi.fn();
      render(<OTPInput defaultValue="12" onChange={onChange} autoFocus={false} />);
      getCell(1).focus();
      fireEvent.keyDown(getCell(1), { key: "Backspace" });
      expect(getCell(1).value).toBe("");
    });

    it("Backspace on empty cell moves to previous and clears", async () => {
      const onChange = vi.fn();
      render(<OTPInput defaultValue="12" onChange={onChange} autoFocus={false} />);
      getCell(2).focus();
      fireEvent.keyDown(getCell(2), { key: "Backspace" });
      expect(getCell(1).value).toBe("");
      expect(document.activeElement).toBe(getCell(1));
    });

    it("Delete clears current cell", async () => {
      render(<OTPInput defaultValue="12" autoFocus={false} />);
      getCell(0).focus();
      fireEvent.keyDown(getCell(0), { key: "Delete" });
      expect(getCell(0).value).toBe("");
    });
  });

  // ── onComplete ────────────────────────────────────────────

  describe("onComplete", () => {
    it("fires when all digits entered via paste", () => {
      const onComplete = vi.fn();
      render(<OTPInput onComplete={onComplete} autoFocus={false} />);
      fireEvent.paste(getCell(0), {
        clipboardData: { getData: () => "123456" } as unknown as DataTransfer,
      });
      expect(onComplete).toHaveBeenCalledWith("123456");
    });

    it("fires for 4-digit OTP via paste", () => {
      const onComplete = vi.fn();
      render(<OTPInput length={4} onComplete={onComplete} autoFocus={false} />);
      fireEvent.paste(getCell(0), {
        clipboardData: { getData: () => "1234" } as unknown as DataTransfer,
      });
      expect(onComplete).toHaveBeenCalledWith("1234");
    });

    it("fires when typing all cells sequentially", async () => {
      const onComplete = vi.fn();
      render(<OTPInput onComplete={onComplete} autoFocus={false} />);
      await userEvent.type(getCell(0), "1");
      await userEvent.type(getCell(1), "2");
      await userEvent.type(getCell(2), "3");
      await userEvent.type(getCell(3), "4");
      await userEvent.type(getCell(4), "5");
      await userEvent.type(getCell(5), "6");
      expect(onComplete).toHaveBeenCalledWith("123456");
    });

    it("fires for 4-digit OTP by typing", async () => {
      const onComplete = vi.fn();
      render(<OTPInput length={4} onComplete={onComplete} autoFocus={false} />);
      await userEvent.type(getCell(0), "1");
      await userEvent.type(getCell(1), "2");
      await userEvent.type(getCell(2), "3");
      await userEvent.type(getCell(3), "4");
      expect(onComplete).toHaveBeenCalledWith("1234");
    });

    it("does not fire with incomplete digits", async () => {
      const onComplete = vi.fn();
      render(<OTPInput onComplete={onComplete} autoFocus={false} />);
      await userEvent.type(getCell(0), "1");
      await userEvent.type(getCell(1), "2");
      await userEvent.type(getCell(2), "3");
      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  // ── Controlled ────────────────────────────────────────────

  describe("controlled", () => {
    it("displays controlled value", () => {
      render(<OTPInput value="123456" />);
      getCells().forEach((cell, i) => {
        expect(cell.value).toBe(String(i + 1));
      });
    });

    it("hidden input reflects controlled value", () => {
      render(<OTPInput value="123456" />);
      expect(getHiddenInput().value).toBe("123456");
    });
  });

  // ── Uncontrolled ──────────────────────────────────────────

  describe("uncontrolled", () => {
    it("displays defaultValue", () => {
      render(<OTPInput defaultValue="654321" />);
      const expected = "654321";
      getCells().forEach((cell, i) => {
        expect(cell.value).toBe(expected[i]);
      });
    });
  });

  // ── Disabled ──────────────────────────────────────────────

  describe("disabled", () => {
    it("disables all cells", () => {
      render(<OTPInput disabled />);
      getCells().forEach((cell) => {
        expect(cell).toBeDisabled();
      });
    });

    it("applies disabled opacity", () => {
      const { container } = render(<OTPInput disabled />);
      const cell = container.querySelector('input[aria-label^="Digit"]');
      expect(cell?.className).toContain("disabled:opacity-50");
    });
  });

  // ── Error ─────────────────────────────────────────────────

  describe("error", () => {
    it("applies danger border when error", () => {
      const { container } = render(<OTPInput error />);
      expect(container.querySelector(".border-danger")).toBeTruthy();
    });
  });

  // ── Size ──────────────────────────────────────────────────

  describe("size", () => {
    it("applies sm size classes", () => {
      const { container } = render(<OTPInput size="sm" />);
      expect(container.querySelector(".w-8")).toBeTruthy();
    });

    it("applies md size classes", () => {
      const { container } = render(<OTPInput size="md" />);
      expect(container.querySelector(".w-10")).toBeTruthy();
    });

    it("applies lg size classes", () => {
      const { container } = render(<OTPInput size="lg" />);
      expect(container.querySelector(".w-12")).toBeTruthy();
    });
  });

  // ── Separator ─────────────────────────────────────────────

  describe("separator", () => {
    it("renders separator between middle cells in 6-digit", () => {
      render(<OTPInput separator={<span data-testid="sep">-</span>} />);
      expect(screen.getByTestId("sep")).toBeTruthy();
    });

    it("no separator rendered in 4-digit", () => {
      render(<OTPInput length={4} separator={<span data-testid="sep">-</span>} />);
      expect(screen.queryByTestId("sep")).toBeNull();
    });
  });

  // ── Placeholder ───────────────────────────────────────────

  describe("placeholder", () => {
    it("cells have placeholder", () => {
      render(<OTPInput placeholder="•" />);
      getCells().forEach((cell) => {
        expect(cell).toHaveAttribute("placeholder", "•");
      });
    });
  });

  // ── className ─────────────────────────────────────────────

  describe("className", () => {
    it("applies custom className to outer wrapper", () => {
      const { container } = render(<OTPInput className="my-class" />);
      expect(container.firstElementChild!.className).toContain("my-class");
    });
  });

  // ── Forwarded Ref ─────────────────────────────────────────

  describe("forwarded ref", () => {
    it("exposes the first input via ref", () => {
      const ref = { current: null as HTMLInputElement | null };
      render(<OTPInput ref={ref} />);
      expect(ref.current).toBeTruthy();
      expect(ref.current!.tagName).toBe("INPUT");
      expect(ref.current!.getAttribute("aria-label")).toBe("Digit 1 of 6");
    });
  });
});
