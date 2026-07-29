import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input, Button } from "@/shared/components";
import { useCreateWithdrawal } from "../hooks";
import { withdrawalSchema } from "../schemas";
import type { WithdrawalFormData } from "../schemas";

interface WithdrawalDialogProps {
  open: boolean;
  onClose: () => void;
  accounts: { id: string; nickname: string | null; accountNumber: string }[];
}

export function WithdrawalDialog({ open, onClose, accounts }: WithdrawalDialogProps) {
  const createWithdrawal = useCreateWithdrawal();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: { accountId: "", amountCents: 0, description: "" },
  });

  if (!open) return null;

  async function onSubmit(data: WithdrawalFormData) {
    try {
      await createWithdrawal.mutateAsync({
        accountId: data.accountId,
        amountCents: Math.round(data.amountCents * 100),
        description: data.description || undefined,
      });
      toast.success("Withdrawal completed successfully");
      reset();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Withdrawal failed");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-border-default bg-bg-primary p-6 shadow-elevation-xl">
        <h2 className="text-lg font-semibold text-text-primary">Withdraw Funds</h2>
        <p className="mt-1 text-sm text-text-secondary">Withdraw funds from an account.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Account</label>
            <select
              {...register("accountId")}
              className="w-full rounded-lg border border-border-default bg-surface-primary px-3 py-2 text-sm text-text-primary focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            >
              <option value="">Select account...</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nickname ?? a.accountNumber}
                </option>
              ))}
            </select>
            {errors.accountId && <p className="mt-1 text-xs text-danger">{errors.accountId.message}</p>}
          </div>

          <Input
            label="Amount (USD)"
            type="number"
            step="0.01"
            min="0.01"
            errorText={errors.amountCents?.message}
            {...register("amountCents", { valueAsNumber: true })}
          />

          <Input
            label="Description (optional)"
            placeholder="e.g. ATM withdrawal"
            errorText={errors.description?.message}
            {...register("description")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Withdraw</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
