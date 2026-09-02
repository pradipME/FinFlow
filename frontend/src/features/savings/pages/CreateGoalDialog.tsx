import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input, Button, Modal, Select } from "@/shared/components";
import { useAccounts } from "@/features/accounts/hooks";
import { useCreateSavingsGoal } from "../hooks";
import { createSavingsGoalSchema } from "../schemas";
import type { CreateSavingsGoalFormData } from "../schemas";

interface CreateGoalDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateGoalDialog({ open, onClose }: CreateGoalDialogProps) {
  const createGoal = useCreateSavingsGoal();
  const { data: accountsData } = useAccounts();
  const accounts = accountsData?.content ?? [];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateSavingsGoalFormData>({
    resolver: zodResolver(createSavingsGoalSchema),
    defaultValues: { accountId: "", goalName: "", targetAmountCents: 0, deadline: "", description: "" },
  });

  const selectedAccount = accounts.find((a) => a.id === watch("accountId"));

  useEffect(() => {
    if (open && selectedAccount) {
      setValue("targetAmountCents", 0);
    }
  }, [open, selectedAccount, setValue]);

  async function onSubmit(data: CreateSavingsGoalFormData) {
    try {
      await createGoal.mutateAsync({
        accountId: data.accountId,
        goalName: data.goalName,
        targetAmountCents: Math.round(data.targetAmountCents * 100),
        currency: selectedAccount?.currency,
        deadline: data.deadline || undefined,
        description: data.description || undefined,
      });
      toast.success("Savings goal created");
      reset();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create goal");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Savings Goal"
      description="Set a target to save toward."
      footer={
        <>
          <Button type="button" variant="neutral" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="create-goal-form" isLoading={isSubmitting}>
            Create Goal
          </Button>
        </>
      }
    >
      <form id="create-goal-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Account"
          {...register("accountId")}
          error={errors.accountId?.message}
          options={[
            { value: "", label: "Select account..." },
            ...accounts.map((a) => ({
              value: a.id,
              label: `${a.nickname ?? a.accountNumber} (${a.currency})`,
            })),
          ]}
        />

        <Input
          label="Goal Name"
          placeholder="e.g. Emergency Fund"
          errorText={errors.goalName?.message}
          {...register("goalName")}
        />

        <Input
          label={`Target Amount (${selectedAccount?.currency ?? "USD"})`}
          type="number"
          step="0.01"
          min="0.01"
          errorText={errors.targetAmountCents?.message}
          {...register("targetAmountCents", { valueAsNumber: true })}
        />

        <Input
          label="Deadline (optional)"
          type="date"
          errorText={errors.deadline?.message}
          {...register("deadline")}
        />

        <Input
          label="Description (optional)"
          placeholder="What is this goal for?"
          errorText={errors.description?.message}
          {...register("description")}
        />
      </form>
    </Modal>
  );
}