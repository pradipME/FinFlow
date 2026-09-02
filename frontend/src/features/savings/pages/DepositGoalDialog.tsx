import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input, Button, Modal } from "@/shared/components";
import { useDepositToSavingsGoal } from "../hooks";
import { depositToGoalSchema } from "../schemas";
import type { DepositToGoalFormData } from "../schemas";

interface DepositGoalDialogProps {
  goalId: string | null;
  currency: string;
  open: boolean;
  onClose: () => void;
}

export function DepositGoalDialog({ goalId, currency, open, onClose }: DepositGoalDialogProps) {
  const deposit = useDepositToSavingsGoal();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepositToGoalFormData>({
    resolver: zodResolver(depositToGoalSchema),
    defaultValues: { amountCents: 0 },
  });

  async function onSubmit(data: DepositToGoalFormData) {
    if (!goalId) return;
    try {
      await deposit.mutateAsync({ id: goalId, payload: { amountCents: Math.round(data.amountCents * 100) } });
      toast.success("Money added to goal");
      reset();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Deposit failed");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add to Goal"
      description={`Transfer funds to this goal (${currency}).`}
      footer={
        <>
          <Button type="button" variant="neutral" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="deposit-goal-form" isLoading={isSubmitting}>
            Add Money
          </Button>
        </>
      }
    >
      <form id="deposit-goal-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label={`Amount (${currency})`}
          type="number"
          step="0.01"
          min="0.01"
          errorText={errors.amountCents?.message}
          {...register("amountCents", { valueAsNumber: true })}
        />
      </form>
    </Modal>
  );
}