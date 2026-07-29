import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input, Button } from "@/shared/components";
import { useCreateTransfer } from "../hooks";
import { transferSchema } from "../schemas";
import type { TransferFormData } from "../schemas";

interface TransferDialogProps {
  open: boolean;
  onClose: () => void;
  accounts: { id: string; nickname: string | null; accountNumber: string }[];
}

export function TransferDialog({ open, onClose, accounts }: TransferDialogProps) {
  const createTransfer = useCreateTransfer();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: { sourceAccountId: "", targetAccountId: "", amountCents: 0, description: "" },
  });

  if (!open) return null;

  async function onSubmit(data: TransferFormData) {
    try {
      await createTransfer.mutateAsync({
        sourceAccountId: data.sourceAccountId,
        targetAccountId: data.targetAccountId,
        amountCents: Math.round(data.amountCents * 100),
        description: data.description || undefined,
      });
      toast.success("Transfer completed successfully");
      reset();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Transfer failed");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-border-default bg-bg-primary p-6 shadow-elevation-xl">
        <h2 className="text-lg font-semibold text-text-primary">Transfer Funds</h2>
        <p className="mt-1 text-sm text-text-secondary">Transfer between accounts.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">From Account</label>
            <select
              {...register("sourceAccountId")}
              className="w-full rounded-lg border border-border-default bg-surface-primary px-3 py-2 text-sm text-text-primary focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            >
              <option value="">Select source...</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.nickname ?? a.accountNumber}</option>
              ))}
            </select>
            {errors.sourceAccountId && <p className="mt-1 text-xs text-danger">{errors.sourceAccountId.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">To Account</label>
            <select
              {...register("targetAccountId")}
              className="w-full rounded-lg border border-border-default bg-surface-primary px-3 py-2 text-sm text-text-primary focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            >
              <option value="">Select target...</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.nickname ?? a.accountNumber}</option>
              ))}
            </select>
            {errors.targetAccountId && <p className="mt-1 text-xs text-danger">{errors.targetAccountId.message}</p>}
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
            placeholder="e.g. Rent payment"
            errorText={errors.description?.message}
            {...register("description")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Transfer</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
