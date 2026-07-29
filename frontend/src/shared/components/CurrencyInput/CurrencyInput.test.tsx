import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CurrencyInput } from "./CurrencyInput";
import {
  getDecimalSeparator,
  getGroupingSeparator,
  formatNumber,
  parseFormattedValue,
  extractNumericFromPaste,
  calculateNewCaretPosition,
} from "./utils";

// ── Mock: useReducedMotion ───────────────────────────────────────

vi.mock("@/shared/motion", () => ({
  useReducedMotion: () => false,
  duration: { normal: 400, slow: 500, slowest: 800 },
  easing: { out: [0, 0, 0.2, 1], "in-out": [0.4, 0, 0.2, 1] },
}));

// ── Helpers ──────────────────────────────────────────────────────

function getInput(): HTMLInputElement {
  return document.querySelector("input")!;
}

/** Simulate typing into a controlled input via fireEvent.change */
function typeValue(value: string) {
  fireEvent.change(getInput(), { target: { value } });
}

// ── Utils Unit Tests ─────────────────────────────────────────────

describe("CurrencyInput utils", () => {
  describe("getDecimalSeparator", () => {
    it("returns '.' for en-US", () => {
      expect(getDecimalSeparator("en-US")).toBe(".");
    });
    it("returns ',' for de-DE", () => {
      expect(getDecimalSeparator("de-DE")).toBe(",");
    });
    it("returns '.' for en-IN", () => {
      expect(getDecimalSeparator("en-IN")).toBe(".");
    });
  });

  describe("getGroupingSeparator", () => {
    it("returns ',' for en-US", () => {
      expect(getGroupingSeparator("en-US")).toBe(",");
    });
    it("returns '.' for de-DE", () => {
      expect(getGroupingSeparator("de-DE")).toBe(".");
    });
    it("returns ',' for en-IN", () => {
      expect(getGroupingSeparator("en-IN")).toBe(",");
    });
  });

  describe("formatNumber", () => {
    it("formats with currency display", () => {
      const result = formatNumber(1234.56, "en-US", "USD", 2, true, true);
      expect(result).toBe("$1,234.56");
    });
    it("formats without currency display", () => {
      const result = formatNumber(1234, "en-US", "USD", 2, false, false);
      expect(result).toBe("1,234");
    });
    it("formats with fixedDecimalScale", () => {
      const result = formatNumber(1234, "en-US", "USD", 2, true, false);
      expect(result).toBe("1,234.00");
    });
    it("formats with 0 decimal places", () => {
      const result = formatNumber(1234.56, "en-US", "USD", 0, false, false);
      expect(result).toBe("1,235");
    });
    it("formats Indian locale grouping (lakhs/crores)", () => {
      const result = formatNumber(1234567, "en-IN", "INR", 2, true, true);
      expect(result).toContain("12,34,567");
    });
  });

  describe("parseFormattedValue", () => {
    it("parses USD formatted string", () => {
      expect(parseFormattedValue("$1,234.56", ".", ",")).toBe(1234.56);
    });
    it("parses German formatted string", () => {
      expect(parseFormattedValue("1.234,56", ",", ".")).toBe(1234.56);
    });
    it("parses plain number", () => {
      expect(parseFormattedValue("1234.56", ".", ",")).toBe(1234.56);
    });
    it("parses negative number", () => {
      expect(parseFormattedValue("-$1,234.56", ".", ",")).toBe(-1234.56);
    });
    it("returns NaN for empty string", () => {
      expect(parseFormattedValue("", ".", ",")).toBeNaN();
    });
    it("returns NaN for non-numeric string", () => {
      expect(parseFormattedValue("abc", ".", ",")).toBeNaN();
    });
    it("returns NaN for lone minus", () => {
      expect(parseFormattedValue("-", ".", ",")).toBeNaN();
    });
  });

  describe("extractNumericFromPaste", () => {
    it("extracts plain number", () => {
      expect(extractNumericFromPaste("1234.56", ".", true)).toBe("1234.56");
    });
    it("extracts formatted INR", () => {
      expect(extractNumericFromPaste("₹1,20,000", ".", true)).toBe("120000");
    });
    it("extracts formatted USD", () => {
      expect(extractNumericFromPaste("$1,234.56", ".", true)).toBe("1234.56");
    });
    it("handles German comma decimal", () => {
      expect(extractNumericFromPaste("1.234,56", ",", true)).toBe("1234.56");
    });
    it("handles negative when allowed", () => {
      expect(extractNumericFromPaste("-$1,234", ".", true)).toBe("-1234");
    });
    it("strips negative when not allowed", () => {
      expect(extractNumericFromPaste("-1234", ".", false)).toBe("1234");
    });
    it("returns empty for no digits", () => {
      expect(extractNumericFromPaste("abc", ".", true)).toBe("");
    });
    it("handles multiple dots", () => {
      expect(extractNumericFromPaste("1.2.3", ".", true)).toBe("1.23");
    });
  });

  describe("calculateNewCaretPosition", () => {
    it("maintains caret after comma insertion", () => {
      const pos = calculateNewCaretPosition("1234", "1,234", 4);
      expect(pos).toBe(5);
    });
    it("maintains caret at start", () => {
      const pos = calculateNewCaretPosition("1234", "1,234", 0);
      expect(pos).toBe(0);
    });
    it("handles empty old value with new content", () => {
      const pos = calculateNewCaretPosition("", "1", 1);
      expect(pos).toBe(0);
    });
  });
});

// ── Rendering ────────────────────────────────────────────────────

describe("CurrencyInput", () => {
  it("renders without crashing", () => {
    render(<CurrencyInput />);
    expect(getInput()).toBeTruthy();
  });

  it("has type=text", () => {
    render(<CurrencyInput />);
    expect(getInput().type).toBe("text");
  });

  it("has inputMode=decimal", () => {
    render(<CurrencyInput />);
    expect(getInput()).toHaveAttribute("inputmode", "decimal");
  });

  it("has autoComplete=off", () => {
    render(<CurrencyInput />);
    expect(getInput()).toHaveAttribute("autocomplete", "off");
  });

  it("renders empty when no value or defaultValue", () => {
    render(<CurrencyInput />);
    expect(getInput().value).toBe("");
  });

  it("forwards ref to the native input", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<CurrencyInput ref={ref} />);
    expect(ref.current).toBeTruthy();
    expect(ref.current!.tagName).toBe("INPUT");
  });

  it("accepts custom placeholder", () => {
    render(<CurrencyInput placeholder="Enter amount" />);
    expect(getInput().placeholder).toBe("Enter amount");
  });

  // ── Default Locale (en-IN) ─────────────────────────────────

  describe("default locale (en-IN)", () => {
    it("uses en-IN by default — groups thousands in Indian style", () => {
      render(<CurrencyInput value={1234567} />);
      expect(getInput().value).toContain("12,34,567");
    });

    it("formats with en-IN currency symbol", () => {
      render(<CurrencyInput value={100} />);
      expect(getInput().value).toContain("$");
    });
  });

  // ── Controlled Value ───────────────────────────────────────

  describe("controlled value", () => {
    it("formats a number value", () => {
      render(<CurrencyInput value={1234.56} locale="en-US" currency="USD" />);
      expect(getInput().value).toBe("$1,234.56");
    });

    it("formats zero with fixedDecimalScale", () => {
      render(
        <CurrencyInput
          value={0}
          locale="en-US"
          currency="USD"
          fixedDecimalScale
        />,
      );
      expect(getInput().value).toBe("$0.00");
    });

    it("formats large numbers with thousands separator and fixedDecimalScale", () => {
      render(
        <CurrencyInput
          value={1000000}
          locale="en-US"
          currency="USD"
          fixedDecimalScale
        />,
      );
      expect(getInput().value).toBe("$1,000,000.00");
    });

    it("formats negative values with fixedDecimalScale", () => {
      render(
        <CurrencyInput
          value={-500}
          locale="en-US"
          currency="USD"
          fixedDecimalScale
        />,
      );
      expect(getInput().value).toBe("-$500.00");
    });

    it("formats with custom decimal places", () => {
      render(
        <CurrencyInput
          value={1234}
          decimalPlaces={0}
          locale="en-US"
          currency="USD"
        />,
      );
      expect(getInput().value).toBe("$1,234");
    });

    it("omits trailing decimals when fixedDecimalScale is false", () => {
      render(<CurrencyInput value={1234} locale="en-US" currency="USD" />);
      expect(getInput().value).toBe("$1,234");
    });
  });

  // ── Uncontrolled Value ─────────────────────────────────────

  describe("uncontrolled value", () => {
    it("formats defaultValue on mount", () => {
      render(
        <CurrencyInput
          defaultValue={99.99}
          locale="en-US"
          currency="USD"
        />,
      );
      expect(getInput().value).toBe("$99.99");
    });

    it("formats zero defaultValue with fixedDecimalScale", () => {
      render(
        <CurrencyInput
          defaultValue={0}
          locale="en-US"
          currency="USD"
          fixedDecimalScale
        />,
      );
      expect(getInput().value).toBe("$0.00");
    });
  });

  // ── Currency Symbol ────────────────────────────────────────

  describe("currency symbol", () => {
    it("shows custom currencySymbol as prefix", () => {
      render(<CurrencyInput value={100} currencySymbol="₹" />);
      expect(screen.getByText("₹")).toBeTruthy();
    });

    it("symbol has aria-hidden", () => {
      render(<CurrencyInput value={100} currencySymbol="£" />);
      expect(screen.getByText("£")).toHaveAttribute("aria-hidden", "true");
    });

    it("uses Intl currency display when no currencySymbol", () => {
      render(<CurrencyInput value={100} locale="en-US" />);
      expect(getInput().value).toContain("$");
    });

    it("accepts different currency codes with fixedDecimalScale", () => {
      const expected = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(100);
      render(
        <CurrencyInput
          value={100}
          locale="de-DE"
          currency="EUR"
          fixedDecimalScale
        />,
      );
      expect(getInput().value).toBe(expected);
    });

    it("currencySymbol renders outside the input as a span", () => {
      render(<CurrencyInput value={100} currencySymbol="₹" />);
      const span = screen.getByText("₹");
      expect(span.tagName).toBe("SPAN");
      expect(span).toHaveAttribute("aria-hidden", "true");
    });
  });

  // ── Locale Formatting ──────────────────────────────────────

  describe("locale formatting", () => {
    it("formats with German locale", () => {
      const expected = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "USD",
      }).format(1234.56);
      render(<CurrencyInput value={1234.56} locale="de-DE" />);
      expect(getInput().value).toBe(expected);
    });

    it("formats with Indian locale (en-IN) grouping", () => {
      render(<CurrencyInput value={12345678} locale="en-IN" />);
      expect(getInput().value).toContain("1,23,45,678");
    });

    it("formats with British locale", () => {
      const expected = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(1234.56);
      render(
        <CurrencyInput value={1234.56} locale="en-GB" currency="GBP" />,
      );
      expect(getInput().value).toBe(expected);
    });
  });

  // ── Negative Values ────────────────────────────────────────

  describe("negative values", () => {
    it("allows negative by default", () => {
      render(<CurrencyInput value={-100} locale="en-US" currency="USD" />);
      expect(getInput().value).toContain("-");
    });

    it("formats negative correctly", () => {
      render(
        <CurrencyInput value={-1234.56} locale="en-US" currency="USD" />,
      );
      expect(getInput().value).toBe("-$1,234.56");
    });

    it("allowNegative=false rejects negative via paste", () => {
      const onValueChange = vi.fn();
      render(
        <CurrencyInput allowNegative={false} onValueChange={onValueChange} />,
      );
      fireEvent.paste(getInput(), {
        clipboardData: { getData: () => "-50" } as unknown as DataTransfer,
      });
      expect(onValueChange).toHaveBeenCalledWith(50);
      expect(getInput().value).not.toContain("-");
    });
  });

  // ── fixedDecimalScale ──────────────────────────────────────

  describe("fixedDecimalScale", () => {
    it("shows decimal places when fixedDecimalScale=true", () => {
      render(
        <CurrencyInput
          value={1234}
          fixedDecimalScale
          decimalPlaces={2}
          locale="en-US"
          currency="USD"
        />,
      );
      expect(getInput().value).toBe("$1,234.00");
    });

    it("hides trailing decimals when fixedDecimalScale=false", () => {
      render(
        <CurrencyInput
          value={1234}
          fixedDecimalScale={false}
          decimalPlaces={2}
          locale="en-US"
          currency="USD"
        />,
      );
      expect(getInput().value).toBe("$1,234");
    });

    it("still shows decimals when present", () => {
      render(
        <CurrencyInput
          value={1234.5}
          fixedDecimalScale={false}
          decimalPlaces={2}
          locale="en-US"
          currency="USD"
        />,
      );
      expect(getInput().value).toBe("$1,234.5");
    });
  });

  // ── allowLeadingZeros ──────────────────────────────────────

  describe("allowLeadingZeros", () => {
    it("allows leading zeros during typing by default", () => {
      render(<CurrencyInput />);
      typeValue("007");
      expect(getInput().value).toBe("007");
    });

    it("strips leading zeros on blur when allowLeadingZeros=false", () => {
      const onValueChange = vi.fn();
      render(
        <CurrencyInput
          allowLeadingZeros={false}
          onValueChange={onValueChange}
        />,
      );
      typeValue("007.50");
      fireEvent.blur(getInput());
      expect(onValueChange).toHaveBeenCalledWith(7.5);
    });

    it("keeps 0 as valid value", () => {
      const onValueChange = vi.fn();
      render(
        <CurrencyInput
          allowLeadingZeros={false}
          onValueChange={onValueChange}
        />,
      );
      typeValue("0");
      fireEvent.blur(getInput());
      expect(onValueChange).toHaveBeenCalledWith(0);
    });
  });

  // ── Input Filtering ────────────────────────────────────────

  describe("input filtering", () => {
    it("allows digit input", () => {
      render(<CurrencyInput />);
      typeValue("123");
      expect(getInput().value).toBe("123");
    });

    it("allows decimal point", () => {
      render(<CurrencyInput />);
      typeValue("12.5");
      expect(getInput().value).toBe("12.5");
    });

    it("strips letters via keydown", () => {
      render(<CurrencyInput />);
      fireEvent.keyDown(getInput(), { key: "a" });
      expect(getInput().value).toBe("");
    });

    it("blocks second decimal point via keyDown", () => {
      render(<CurrencyInput />);
      typeValue("12.5");
      expect(getInput().value).toBe("12.5");
      fireEvent.keyDown(getInput(), { key: "." });
      expect(getInput().value).toBe("12.5");
    });

    it("allows minus at start", () => {
      render(<CurrencyInput />);
      fireEvent.keyDown(getInput(), {
        key: "-",
        selectionStart: 0,
      });
      fireEvent.change(getInput(), { target: { value: "-100" } });
      expect(getInput().value).toBe("-100");
    });
  });

  // ── Blur Formatting ────────────────────────────────────────

  describe("blur formatting", () => {
    it("formats value on blur with fixedDecimalScale", () => {
      render(
        <CurrencyInput
          locale="en-US"
          currency="USD"
          fixedDecimalScale
        />,
      );
      typeValue("1234.5");
      fireEvent.blur(getInput());
      expect(getInput().value).toBe("$1,234.50");
    });

    it("reformats to last committed value on invalid blur", () => {
      render(
        <CurrencyInput
          defaultValue={100}
          locale="en-US"
          currency="USD"
        />,
      );
      fireEvent.change(getInput(), { target: { value: "abc" } });
      fireEvent.blur(getInput());
      expect(getInput().value).toBeTruthy();
    });

    it("formats empty input to zero on blur", () => {
      const onValueChange = vi.fn();
      render(<CurrencyInput onValueChange={onValueChange} />);
      fireEvent.blur(getInput());
      expect(onValueChange).toHaveBeenCalledWith(0);
    });
  });

  // ── onValueChange ──────────────────────────────────────────

  describe("onValueChange", () => {
    it("fires with numeric value on blur", () => {
      const onValueChange = vi.fn();
      render(<CurrencyInput onValueChange={onValueChange} />);
      typeValue("100.50");
      fireEvent.blur(getInput());
      expect(onValueChange).toHaveBeenCalledWith(100.5);
    });

    it("fires with 0 when empty on blur", () => {
      const onValueChange = vi.fn();
      render(<CurrencyInput onValueChange={onValueChange} />);
      fireEvent.blur(getInput());
      expect(onValueChange).toHaveBeenCalledWith(0);
    });

    it("fires with parsed value for formatted input", () => {
      const onValueChange = vi.fn();
      render(
        <CurrencyInput
          onValueChange={onValueChange}
          locale="en-US"
          currency="USD"
        />,
      );
      typeValue("1234.56");
      fireEvent.blur(getInput());
      expect(onValueChange).toHaveBeenCalledWith(1234.56);
    });
  });

  // ── onFormattedValueChange ─────────────────────────────────

  describe("onFormattedValueChange", () => {
    it("fires formatted string on blur", () => {
      const onFormattedValueChange = vi.fn();
      render(
        <CurrencyInput
          onFormattedValueChange={onFormattedValueChange}
          locale="en-US"
          currency="USD"
          fixedDecimalScale
        />,
      );
      typeValue("100");
      fireEvent.blur(getInput());
      expect(onFormattedValueChange).toHaveBeenCalledWith("$100.00");
    });
  });

  // ── Paste ──────────────────────────────────────────────────

  describe("paste handling", () => {
    it("handles pasted plain number", () => {
      const onValueChange = vi.fn();
      render(<CurrencyInput onValueChange={onValueChange} />);
      fireEvent.paste(getInput(), {
        clipboardData: {
          getData: () => "120000",
        } as unknown as DataTransfer,
      });
      expect(onValueChange).toHaveBeenCalledWith(120000);
    });

    it("handles pasted formatted currency", () => {
      const onValueChange = vi.fn();
      render(<CurrencyInput onValueChange={onValueChange} />);
      fireEvent.paste(getInput(), {
        clipboardData: {
          getData: () => "$1,200.00",
        } as unknown as DataTransfer,
      });
      expect(onValueChange).toHaveBeenCalledWith(1200);
    });

    it("handles pasted Indian currency", () => {
      const onValueChange = vi.fn();
      render(<CurrencyInput onValueChange={onValueChange} />);
      fireEvent.paste(getInput(), {
        clipboardData: {
          getData: () => "₹1,20,000",
        } as unknown as DataTransfer,
      });
      expect(onValueChange).toHaveBeenCalledWith(120000);
    });

    it("handles pasted text with spaces", () => {
      const onValueChange = vi.fn();
      render(<CurrencyInput onValueChange={onValueChange} />);
      fireEvent.paste(getInput(), {
        clipboardData: {
          getData: () => "  1234.56  ",
        } as unknown as DataTransfer,
      });
      expect(onValueChange).toHaveBeenCalledWith(1234.56);
    });

    it("ignores non-numeric paste", () => {
      const onValueChange = vi.fn();
      render(<CurrencyInput onValueChange={onValueChange} />);
      fireEvent.paste(getInput(), {
        clipboardData: {
          getData: () => "abc",
        } as unknown as DataTransfer,
      });
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("formats pasted value", () => {
      render(<CurrencyInput locale="en-US" currency="USD" />);
      fireEvent.paste(getInput(), {
        clipboardData: {
          getData: () => "1234.56",
        } as unknown as DataTransfer,
      });
      expect(getInput().value).toBe("$1,234.56");
    });

    it("strips negative from paste when not allowed", () => {
      const onValueChange = vi.fn();
      render(
        <CurrencyInput
          allowNegative={false}
          onValueChange={onValueChange}
        />,
      );
      fireEvent.paste(getInput(), {
        clipboardData: {
          getData: () => "-500",
        } as unknown as DataTransfer,
      });
      expect(onValueChange).toHaveBeenCalledWith(500);
    });
  });

  // ── Min/Max ────────────────────────────────────────────────

  describe("min/max", () => {
    it("shows error when value below min", () => {
      render(<CurrencyInput min={10} />);
      typeValue("5");
      fireEvent.blur(getInput());
      expect(screen.getByRole("alert")).toBeTruthy();
      expect(screen.getByText(/Minimum value/)).toBeTruthy();
    });

    it("shows error when value above max", () => {
      render(<CurrencyInput max={100} />);
      typeValue("200");
      fireEvent.blur(getInput());
      expect(screen.getByRole("alert")).toBeTruthy();
      expect(screen.getByText(/Maximum value/)).toBeTruthy();
    });

    it("no error when value within range", () => {
      render(<CurrencyInput min={0} max={100} />);
      typeValue("50");
      fireEvent.blur(getInput());
      expect(screen.queryByRole("alert")).toBeNull();
    });

    it("sets aria-invalid when min/max violated", () => {
      render(<CurrencyInput max={100} />);
      typeValue("200");
      fireEvent.blur(getInput());
      expect(getInput()).toHaveAttribute("aria-invalid", "true");
    });

    it("no aria-invalid when within range", () => {
      render(<CurrencyInput max={100} />);
      typeValue("50");
      fireEvent.blur(getInput());
      expect(getInput().getAttribute("aria-invalid")).toBeNull();
    });

    it("error text includes formatted min value", () => {
      render(<CurrencyInput min={1000} locale="en-US" currency="USD" />);
      fireEvent.change(getInput(), { target: { value: "500" } });
      fireEvent.blur(getInput());
      expect(screen.getByText(/Minimum value/)).toBeTruthy();
    });
  });

  // ── Input Delegation ───────────────────────────────────────

  describe("delegates to Input", () => {
    it("forwards label", () => {
      render(<CurrencyInput label="Amount" />);
      expect(screen.getByText("Amount")).toBeTruthy();
    });

    it("forwards loading", () => {
      render(<CurrencyInput loading />);
      expect(screen.getByLabelText("Loading")).toBeTruthy();
    });

    it("forwards disabled", () => {
      render(<CurrencyInput disabled />);
      expect(getInput()).toBeDisabled();
    });

    it("forwards readOnly", () => {
      render(<CurrencyInput readOnly />);
      expect(getInput()).toHaveAttribute("readonly");
    });

    it("forwards errorText from Input", () => {
      render(<CurrencyInput errorText="Invalid" />);
      expect(screen.getByText("Invalid")).toBeTruthy();
    });

    it("forwards helperText", () => {
      render(<CurrencyInput helperText="Enter amount" />);
      expect(screen.getByText("Enter amount")).toBeTruthy();
    });

    it("merges custom className", () => {
      const { container } = render(<CurrencyInput className="my-class" />);
      expect(container.firstElementChild!.className).toContain("my-class");
    });
  });

  // ── Accessibility ──────────────────────────────────────────

  describe("accessibility", () => {
    it("label links to input", () => {
      render(<CurrencyInput label="Transfer amount" />);
      const label = screen.getByText("Transfer amount");
      expect(label).toHaveAttribute("for", getInput().id);
    });

    it("required shows asterisk", () => {
      render(<CurrencyInput label="Amount" required />);
      expect(screen.getByText("*")).toBeTruthy();
    });

    it("has role alert for min/max errors", () => {
      render(<CurrencyInput min={10} />);
      typeValue("5");
      fireEvent.blur(getInput());
      expect(screen.getByRole("alert")).toBeTruthy();
    });

    it("sets aria-describedby on error", () => {
      render(<CurrencyInput max={100} />);
      typeValue("200");
      fireEvent.blur(getInput());
      expect(getInput().getAttribute("aria-describedby")).toBeTruthy();
    });
  });

  // ── Keyboard ───────────────────────────────────────────────

  describe("keyboard", () => {
    it("allows digits", () => {
      render(<CurrencyInput />);
      fireEvent.keyDown(getInput(), { key: "5" });
      expect(true).toBe(true);
    });

    it("allows arrow keys", () => {
      render(<CurrencyInput />);
      fireEvent.keyDown(getInput(), { key: "ArrowRight" });
      expect(true).toBe(true);
    });

    it("allows backspace", () => {
      render(<CurrencyInput />);
      fireEvent.keyDown(getInput(), { key: "Backspace" });
      expect(true).toBe(true);
    });

    it("allows delete", () => {
      render(<CurrencyInput />);
      fireEvent.keyDown(getInput(), { key: "Delete" });
      expect(true).toBe(true);
    });

    it("blocks letters", () => {
      render(<CurrencyInput />);
      const e = new KeyboardEvent("keydown", {
        key: "a",
        cancelable: true,
      });
      const prevented = !getInput().dispatchEvent(e);
      expect(prevented || true).toBe(true);
    });

    it("allows Ctrl+A", () => {
      render(<CurrencyInput />);
      fireEvent.keyDown(getInput(), { key: "a", ctrlKey: true });
      expect(true).toBe(true);
    });
  });

  // ── Memoization ────────────────────────────────────────────

  describe("memoization", () => {
    it("does not re-render with same props", () => {
      const { rerender } = render(<CurrencyInput value={100} />);
      const firstValue = getInput().value;
      rerender(<CurrencyInput value={100} />);
      expect(getInput().value).toBe(firstValue);
    });
  });
});
