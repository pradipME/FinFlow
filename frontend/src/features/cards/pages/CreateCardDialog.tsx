import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input, Button, Modal, Select } from "@/shared/components";
import { useAccounts } from "@/features/accounts/hooks";
import { useCreateCard } from "../hooks";
import { createCardSchema } from "../schemas";
import type { CreateCardFormData } from "../schemas";
import type { CardType } from "../types";

interface CreateCardDialogProps {
  open: boolean;
  onClose: () => void;
}

const CARD_TYPES: { value: CardType; label: string }[] = [
  { value: "DEBIT", label: "Debit" },
  { value: "CREDIT", label: "Credit" },
  { value: "PREPAID", label: "Prepaid" },
];

export function CreateCardDialog({ open, onClose }: CreateCardDialogProps) {
  const createCard = useCreateCard();
  const { data: accountsData } = useAccounts();
  const accounts = accountsData?.content ?? [];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateCardFormData>({
    resolver: zodResolver(createCardSchema),
    defaultValues: {
      accountId: "",
      cardType: undefined,
      cardholderName: "",
      currency: "",
      creditLimitCents: undefined,
      dailyLimitCents: undefined,
      monthlyLimitCents: undefined,
    },
  });

  const selectedAccount = accounts.find((a) => a.id === watch("accountId"));

  useEffect(() => {
    if (selectedAccount) {
      setValue("currency", selectedAccount.currency);
    }
  }, [selectedAccount, setValue, open]);

  async function onSubmit(data: CreateCardFormData) {
    try {
      await createCard.mutateAsync({
        accountId: data.accountId,
        cardType: data.cardType,
        cardholderName: data.cardholderName,
        currency: selectedAccount?.currency ?? (data.currency || undefined),
        creditLimitCents: data.creditLimitCents || undefined,
        dailyLimitCents: data.dailyLimitCents || undefined,
        monthlyLimitCents: data.monthlyLimitCents || undefined,
      });
      toast.success("Card created successfully");
      reset();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create card");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Card"
      description="Issue a new debit, credit, or prepaid card."
      footer={
        <>
          <Button type="button" variant="neutral" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="create-card-form" isLoading={isSubmitting}>
            Add Card
          </Button>
        </>
      }
    >
      <form id="create-card-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <Select
          label="Card Type"
          {...register("cardType")}
          error={errors.cardType?.message}
          options={[
            { value: "", label: "Select type..." },
            ...CARD_TYPES.map((t) => ({ value: t.value, label: t.label })),
          ]}
        />

        <Input
          label="Cardholder Name"
          placeholder="Name on card"
          errorText={errors.cardholderName?.message}
          {...register("cardholderName")}
        />

        {watch("cardType") === "CREDIT" && (
          <Input
            label={`Credit Limit (${selectedAccount?.currency ?? "USD"})`}
            type="number"
            step="0.01"
            min="0"
            errorText={errors.creditLimitCents?.message}
            {...register("creditLimitCents", { valueAsNumber: true })}
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={`Daily Limit (${selectedAccount?.currency ?? "USD"})`}
            type="number"
            step="0.01"
            min="0"
            errorText={errors.dailyLimitCents?.message}
            {...register("dailyLimitCents", { valueAsNumber: true })}
          />
          <Input
            label={`Monthly Limit (${selectedAccount?.currency ?? "USD"})`}
            type="number"
            step="0.01"
            min="0"
            errorText={errors.monthlyLimitCents?.message}
            {...register("monthlyLimitCents", { valueAsNumber: true })}
          />
        </div>
      </form>
    </Modal>
  );
}