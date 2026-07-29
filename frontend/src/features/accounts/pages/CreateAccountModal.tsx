import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input, Button } from "@/shared/components";
import { useCreateAccount } from "../hooks";
import { createAccountSchema } from "../schemas";
import type { CreateAccountFormData } from "../schemas";
import type { AccountType } from "../types";

interface CreateAccountModalProps {
  open: boolean;
  onClose: () => void;
}

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "CHECKING", label: "Checking" },
  { value: "SAVINGS", label: "Savings" },
  { value: "CREDIT_CARD", label: "Credit Card" },
];

export function CreateAccountModal({ open, onClose }: CreateAccountModalProps) {
  const createAccount = useCreateAccount();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { accountType: undefined, nickname: "", currency: "" },
  });

  if (!open) return null;

  async function onSubmit(data: CreateAccountFormData) {
    try {
      await createAccount.mutateAsync({
        accountType: data.accountType,
        nickname: data.nickname || undefined,
        currency: data.currency || undefined,
      });
      toast.success("Account created successfully");
      reset();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create account");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-border-default bg-bg-primary p-6 shadow-elevation-xl">
        <h2 className="text-lg font-semibold text-text-primary">Create Account</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Open a new bank account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Account Type
            </label>
            <select
              {...register("accountType")}
              className="w-full rounded-lg border border-border-default bg-surface-primary px-3 py-2 text-sm text-text-primary focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            >
              <option value="">Select type...</option>
              {ACCOUNT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.accountType && (
              <p className="mt-1 text-xs text-danger">{errors.accountType.message}</p>
            )}
          </div>

          <Input
            label="Nickname (optional)"
            placeholder="e.g. My Savings"
            errorText={errors.nickname?.message}
            {...register("nickname")}
          />

          <Input
            label="Currency (optional)"
            placeholder="USD"
            errorText={errors.currency?.message}
            {...register("currency")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
