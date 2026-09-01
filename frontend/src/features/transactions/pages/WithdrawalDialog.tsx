import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input, Button, Modal, Select } from "@/shared/components";
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
          placeholder="e.g. ATM withdrawal"
          errorText={errors.description?.message}
          {...register("description")}
        />
      </form>
    </Modal>
  );
}