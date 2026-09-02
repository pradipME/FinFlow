import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input, Button, Modal, Select } from "@/shared/components";
import { useCreateDeposit } from "../hooks";
import { depositSchema } from "../schemas";
import type { DepositFormData } from "../schemas";
import type { AccountSummary } from "@/features/accounts/types";
import { toErrorMessage } from "@/shared/lib";

interface DepositDialogProps {
  open: boolean;
  onClose: () => void;
  accounts: AccountSummary[];
  /** Pre-select this account when opening from a specific account context. */
  defaultAccountId?: string | null;
}

export function DepositDialog({ open, onClose, accounts, defaultAccountId }: DepositDialogProps) {
  const createDeposit = useCreateDeposit();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
    defaultValues: { accountId: defaultAccountId ?? "", amountCents: 0, description: "" },
  });

  const currency = accounts.find((a) => a.id === watch("accountId"))?.currency ?? "USD";

  async function onSubmit(data: DepositFormData) {
    try {
      await createDeposit.mutateAsync({
        accountId: data.accountId,
        amountCents: Math.round(data.amountCents * 100),
        description: data.description || undefined,
      });
      toast.success("Deposit completed successfully");
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
      title="Deposit Funds"
      description="Add funds to an account."
      footer={
        <>
          <Button type="button" variant="neutral" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="deposit-form" isLoading={isSubmitting}>Deposit</Button>
        </>
      }
    >
      <form id="deposit-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          placeholder="e.g. Payroll deposit"
          errorText={errors.description?.message}
          {...register("description")}
        />
      </form>
    </Modal>
  );
}