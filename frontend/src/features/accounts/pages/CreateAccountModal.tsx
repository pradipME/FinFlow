import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input, Button, Modal, Select } from "@/shared/components";
import { useCreateAccount } from "../hooks";
import { createAccountSchema } from "../schemas";
import type { CreateAccountFormData } from "../schemas";
import type { AccountType } from "../types";

interface CreateAccountModalProps {
  open: boolean;
  onClose: () => void;
}

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "CHECKING", label: "Checking" },
  { value: "SAVINGS", label: "Savings" },
  { value: "CREDIT_CARD", label: "Credit Card" },
];

export function CreateAccountModal({ open, onClose }: CreateAccountModalProps) {
  const createAccount = useCreateAccount();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { accountType: undefined, nickname: "", currency: "" },
  });

  async function onSubmit(data: CreateAccountFormData) {
    try {
      await createAccount.mutateAsync({
        accountType: data.accountType,
        nickname: data.nickname || undefined,
        currency: data.currency || undefined,
      });
      toast.success("Account created successfully");
      reset();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create account");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Account"
      description="Open a new bank account."
      footer={
        <>
          <Button type="button" variant="neutral" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="create-account-form" isLoading={isSubmitting}>
            Create Account
          </Button>
        </>
      }
    >
      <form id="create-account-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Account Type"
          {...register("accountType")}
          error={errors.accountType?.message}
          options={[
            { value: "", label: "Select type..." },
            ...ACCOUNT_TYPES.map((t) => ({ value: t.value, label: t.label })),
          ]}
        />

        <Input
          label="Nickname (optional)"
          placeholder="e.g. My Savings"
          errorText={errors.nickname?.message}
          {...register("nickname")}
        />

        <Input
          label="Currency (optional)"
          placeholder="USD"
          errorText={errors.currency?.message}
          {...register("currency")}
        />
      </form>
    </Modal>
  );
}