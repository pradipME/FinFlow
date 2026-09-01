import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input, Button, Modal, Select } from "@/shared/components";
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
            ...accounts.map((a) => ({ value: a.id, label: a.nickname ?? a.accountNumber })),
          ]}
        />

        <Select
          label="To Account"
          {...register("targetAccountId")}
          error={errors.targetAccountId?.message}
          options={[
            { value: "", label: "Select target..." },
            ...accounts.map((a) => ({ value: a.id, label: a.nickname ?? a.accountNumber })),
          ]}
        />

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
      </form>
    </Modal>
  );
}