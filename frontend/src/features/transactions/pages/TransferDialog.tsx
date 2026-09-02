import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input, Button, Modal, Select } from "@/shared/components";
import { useCreateTransfer } from "../hooks";
import { transferSchema } from "../schemas";
import type { TransferFormData } from "../schemas";
import type { AccountSummary } from "@/features/accounts/types";
import { toErrorMessage } from "@/shared/lib";

interface TransferDialogProps {
  open: boolean;
  onClose: () => void;
  accounts: AccountSummary[];
  /** Pre-select the source account when opening from a specific account context. */
  defaultAccountId?: string | null;
}

export function TransferDialog({ open, onClose, accounts, defaultAccountId }: TransferDialogProps) {
  const createTransfer = useCreateTransfer();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      sourceAccountId: defaultAccountId ?? "",
      targetAccountId: "",
      amountCents: 0,
      description: "",
    },
  });

  const sourceCurrency = accounts.find((a) => a.id === watch("sourceAccountId"))?.currency ?? "USD";

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
      toast.error(toErrorMessage(err));
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Transfer Funds"
      description="Move money between your accounts."
      footer={
        <>
          <Button type="button" variant="neutral" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="transfer-form" isLoading={isSubmitting}>Transfer</Button>
        </>
      }
    >
      <form id="transfer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="From Account"
          {...register("sourceAccountId")}
          error={errors.sourceAccountId?.message}
          options={[
            { value: "", label: "Select source..." },
            ...accounts.map((a) => ({ value: a.id, label: `${a.nickname ?? a.accountNumber} (${a.currency})` })),
          ]}
        />

        <Select
          label="To Account"
          {...register("targetAccountId")}
          error={errors.targetAccountId?.message}
          options={[
            { value: "", label: "Select target..." },
            ...accounts.map((a) => ({ value: a.id, label: `${a.nickname ?? a.accountNumber} (${a.currency})` })),
          ]}
        />

        <Input
          label={`Amount (${sourceCurrency})`}
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
      </form>
    </Modal>
  );
}