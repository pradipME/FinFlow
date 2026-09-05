import { useState } from "react";
import { toast } from "sonner";
import { Phone, Wallet, ShieldCheck, Check, ArrowLeft, Delete, CreditCard as CardIcon } from "lucide-react";
import { Input, Button, Modal, Select } from "@/shared/components";
import { useCreatePayment } from "../hooks";
import { mobilePaymentSchema } from "../schemas";
import type { AccountSummary } from "@/features/accounts/types";
import { toErrorMessage } from "@/shared/lib";
import { formatCurrency } from "@/shared/lib/format";
import { cn } from "@/shared/utils";

interface MobilePaymentDialogProps {
  open: boolean;
  onClose: () => void;
  accounts: AccountSummary[];
  defaultAccountId?: string | null;
}

/**
 * Aura-style Send Money flow.
 * 1. From (your own account) + Recipient (mobile number) + Amount (numeric keypad).
 * 2. Confirmation summary, then the real server-side payment (`POST /transactions/pay`).
 */
export function MobilePaymentDialog({ open, onClose, accounts, defaultAccountId }: MobilePaymentDialogProps) {
  const createPayment = useCreatePayment();

  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const [sourceAccountId, setSourceAccountId] = useState(defaultAccountId ?? accounts[0]?.id ?? "");
  const [recipientMobile, setRecipientMobile] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ source?: string; recipient?: string; amount?: string }>({});

  const sourceAccount = accounts.find((a) => a.id === sourceAccountId);
  const amountCents = Math.round((parseAmount(amountStr) ?? 0) * 100);

  function parseAmount(s: string): number {
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }

  function maskMobile(mobile: string): string {
    const digits = mobile.replace(/^\+/, "").replace(/\D/g, "");
    if (digits.length < 6) return mobile;
    return `+${digits.slice(0, digits.length - 4)}•••• ${digits.slice(-4)}`;
  }

  function goToConfirm() {
    const parsed = mobilePaymentSchema.safeParse({
      sourceAccountId,
      recipientMobile,
      amountCents: parseAmount(amountStr),
      description: description || undefined,
    });
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "sourceAccountId") next.source = issue.message;
        else if (key === "recipientMobile") next.recipient = issue.message;
        else if (key === "amountCents") next.amount = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setStep("confirm");
  }

  async function confirmAndPay() {
    try {
      await createPayment.mutateAsync({
        sourceAccountId,
        recipientMobile,
        amountCents,
        description: description || undefined,
      });
      toast.success("Payment sent successfully");
      resetFlow();
    } catch (err) {
      toast.error(toErrorMessage(err));
    }
  }

  function resetFlow() {
    setStep("enter");
    setAmountStr("");
    setRecipientMobile("");
    setDescription("");
    setErrors({});
    setSourceAccountId(defaultAccountId ?? accounts[0]?.id ?? "");
  }

  // ── Numeric keypad handlers ───────────────────────────────────────

  function pressKey(key: string) {
    if (key === "del") {
      setAmountStr((cur) => cur.slice(0, -1));
      return;
    }
    if (key === ".") {
      if (!amountStr.includes(".")) setAmountStr((cur) => cur === "" ? "0." : cur + ".");
      return;
    }
    let next = amountStr + key;
    // Keep at most 2 decimal places and a sensible size
    const [whole, frac] = next.split(".");
    if (frac && frac.length > 2) return;
    if (whole.length > 9) return;
    setAmountStr(next);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={step === "enter" ? "Send Money" : "Review & Confirm"}
      description={
        step === "enter"
          ? "Send money to another FinFlow customer using their mobile number."
          : "Double-check the details before sending."
      }
      footer={
        step === "enter" ? (
          <>
            <Button type="button" variant="neutral" onClick={onClose}>Cancel</Button>
            <Button type="button" onClick={goToConfirm}>Continue</Button>
          </>
        ) : (
          <>
            <Button type="button" variant="neutral" onClick={() => setStep("enter")} leftIcon={<ArrowLeft size={16} />}>
              Back
            </Button>
            <Button type="button" onClick={confirmAndPay} isLoading={createPayment.isPending} leftIcon={<Check size={16} />}>
              Confirm & Send
            </Button>
          </>
        )
      }
    >
      {step === "enter" ? (
        <div className="space-y-5">
          {/* From */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">From</p>
            <Select
              className="mt-2"
              value={sourceAccountId}
              onChange={(e) => setSourceAccountId(e.target.value)}
              error={errors.source}
              options={[
                ...accounts.map((a) => ({
                  value: a.id,
                  label: `${a.nickname ?? a.accountType} •••• ${a.accountNumber.slice(-4)} · ${formatCurrency(a.availableBalanceCents / 100, a.currency)}`,
                })),
              ]}
            />
          </div>

          {/* Recipient */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Recipient</p>
            <Input
              className="mt-2"
              type="tel"
              leftIcon={<Phone size={16} />}
              placeholder="+1234567890"
              value={recipientMobile}
              onChange={(e) => setRecipientMobile(e.target.value)}
              error={errors.recipient}
            />
          </div>

          {/* Amount display */}
          <div className="rounded-2xl border border-border-subtle bg-surface-primary px-4 py-4 text-center">
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Amount · {sourceAccount?.currency ?? "USD"}
            </p>
            <p className="font-tabular mt-1 text-center text-3xl font-bold tracking-tight text-text-primary">
              {amountStr === "" ? formatCurrency(0, sourceAccount?.currency) : formatCurrency(parseAmount(amountStr), sourceAccount?.currency)}
            </p>
            {errors.amount && <p className="mt-1 text-center text-xs text-danger">{errors.amount}</p>}
          </div>

          {/* Numeric keypad */}
          <div className="grid grid-cols-3 gap-2.5">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map((key) => (
              <KeypadKey key={key} label={key} onPress={() => pressKey(key)} />
            ))}
            <KeypadKey label={<Delete size={20} />} onPress={() => pressKey("del")} />
          </div>

          <Input
            label="Description (optional)"
            placeholder="e.g. Coffee payment"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="rounded-xl border border-border-subtle bg-bg-secondary px-3.5 py-3 text-sm">
            <p className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-brand-primary" />
              <span className="text-text-secondary">
                Money is sent instantly. Recipient is resolved by their registered mobile number.
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {recipientMobile && (
            <div className="rounded-2xl border border-border-subtle bg-surface-primary p-5">
              <p className="text-xs uppercase tracking-wide text-text-tertiary">Sending to</p>
              <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-text-primary">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary-subtle text-brand-primary">
                  <Phone size={18} />
                </span>
                {maskMobile(recipientMobile)}
              </p>
              <p className="mt-1 text-xs text-text-tertiary">FinFlow customer mobile number</p>
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl border border-border-subtle bg-bg-secondary px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-medium text-text-primary">
              <Wallet size={16} className="text-brand-primary" /> Amount
            </span>
            <span className="font-tabular text-lg font-bold text-text-primary">
              {formatCurrency(parseAmount(amountStr), sourceAccount?.currency)}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border-subtle bg-bg-secondary px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-medium text-text-primary">
              <CardIcon size={16} className="text-brand-primary" /> From
            </span>
            <span className="text-sm font-medium text-text-primary">
              {sourceAccount
                ? `${sourceAccount.nickname ?? sourceAccount.accountType} •••• ${sourceAccount.accountNumber.slice(-4)}`
                : "—"}
            </span>
          </div>

          {description && (
            <p className="text-sm text-text-tertiary">
              Note: <span className="text-text-secondary">{description}</span>
            </p>
          )}

          <div className="rounded-xl border border-brand-primary/30 bg-brand-primary-subtle px-4 py-3 text-sm">
            <p className="flex items-center gap-2 text-text-primary">
              <ShieldCheck size={16} className="text-brand-primary" />
              Press <strong>Confirm &amp; Send</strong> to complete the transfer instantly using your real account balance.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}

function KeypadKey({ label, onPress }: { label: React.ReactNode; onPress: () => void }) {
  return (
    <button
      type="button"
      onClick={onPress}
      className={cn(
        "flex aspect-square items-center justify-center rounded-2xl border border-border-default bg-surface-primary text-lg font-semibold text-text-primary",
        "transition-all duration-150 hover:-translate-y-0.5 hover:bg-surface-secondary active:scale-95",
      )}
    >
      {label}
    </button>
  );
}