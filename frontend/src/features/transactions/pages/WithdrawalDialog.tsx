import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input, Button, Modal, Select } from "@/shared/components";
import { useCreateWithdrawal } from "../hooks";
import { withdrawalSchema } from "../schemas";
import type { WithdrawalFormData } from "../schemas";
import type { AccountSummary } from "@/features/accounts/types";
import { toErrorMessage } from "@/shared/lib";

interface WithdrawalDialogProps {
  open: boolean;
  onClose: () => void;
  accounts: AccountSummary[];
  /** Pre-select this account when opening from a specific account context. */
  defaultAccountId?: string | null;
}

export function WithdrawalDialog({ open, onClose, accounts, defaultAccountId }: WithdrawalDialogProps) {
  const createWithdrawal = useCreateWithdrawal();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: { accountId: defaultAccountId ?? "", amountCents: 0, description: "" },
  });

  const currency = accounts.find((a) => a.id === watch("accountId"))?.currency ?? "USD";

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
      toast.error(toErrorMessage(err));
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Withdraw Funds"
      description="Withdraw funds from an account."
      footer={
        <>
          <Button type="button" variant="neutral" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="withdrawal-form" isLoading={isSubmitting}>Withdraw</Button>
        </>
      }
    >
      <form id="withdrawal-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Account"
          {...register("accountId")}
          error={errors.accountId?.message}
          options={[
            { value: "", label: "Select account..." },
            ...accounts.map((a) => ({ value: a.id, label: `${a.nickname ?? a.accountNumber} (${a.currency})` })),
          ]}
        />

        <Input
          label={`Amount (${currency})`}
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
      </form>
    </Modal>
  );
}