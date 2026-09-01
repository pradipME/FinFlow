import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input, Button, Modal } from "@/shared/components";
import { useCreateBeneficiary, useUpdateBeneficiary } from "../hooks";
import { createBeneficiarySchema } from "../schemas";
import type { CreateBeneficiaryFormData } from "../schemas";
import type { Beneficiary } from "../types";

interface CreateBeneficiaryDialogProps {
  open: boolean;
  onClose: () => void;
  beneficiary?: Beneficiary | null;
}

export function CreateBeneficiaryDialog({ open, onClose, beneficiary }: CreateBeneficiaryDialogProps) {
  const isEditing = !!beneficiary;
  const createBeneficiary = useCreateBeneficiary();
  const updateBeneficiary = useUpdateBeneficiary(beneficiary?.id ?? "");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBeneficiaryFormData>({
    resolver: zodResolver(createBeneficiarySchema),
  });

  useEffect(() => {
    if (beneficiary) {
      reset({
        beneficiaryName: beneficiary.beneficiaryName,
        nickname: beneficiary.nickname ?? "",
        email: beneficiary.email ?? "",
        bankName: beneficiary.bankName ?? "",
        accountNumber: beneficiary.accountNumber,
        routingNumber: beneficiary.routingNumber ?? "",
        iban: beneficiary.iban ?? "",
        swiftCode: beneficiary.swiftCode ?? "",
        currency: beneficiary.currency ?? "",
      });
    } else {
      reset({ beneficiaryName: "", nickname: "", email: "", bankName: "", accountNumber: "", routingNumber: "", iban: "", swiftCode: "", currency: "" });
    }
  }, [beneficiary, reset]);

  async function onSubmit(data: CreateBeneficiaryFormData) {
    const payload = {
      beneficiaryName: data.beneficiaryName,
      nickname: data.nickname || undefined,
      email: data.email || undefined,
      bankName: data.bankName || undefined,
      accountNumber: data.accountNumber,
      routingNumber: data.routingNumber || undefined,
      iban: data.iban || undefined,
      swiftCode: data.swiftCode || undefined,
      currency: data.currency || undefined,
    };

    try {
      if (isEditing) {
        await updateBeneficiary.mutateAsync(payload);
        toast.success("Beneficiary updated");
      } else {
        await createBeneficiary.mutateAsync(payload);
        toast.success("Beneficiary created");
      }
      reset();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save beneficiary");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEditing ? "Edit Beneficiary" : "Add Beneficiary"}
      description="Save a trusted payee for faster transfers."
      footer={
        <>
          <Button type="button" variant="neutral" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="beneficiary-form" isLoading={isSubmitting}>
            {isEditing ? "Save Changes" : "Add Beneficiary"}
          </Button>
        </>
      }
    >
      <form id="beneficiary-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          errorText={errors.beneficiaryName?.message}
          {...register("beneficiaryName")}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nickname (optional)"
            placeholder="My Friend"
            errorText={errors.nickname?.message}
            {...register("nickname")}
          />
          <Input
            label="Email (optional)"
            type="email"
            placeholder="john@example.com"
            errorText={errors.email?.message}
            {...register("email")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Bank Name (optional)"
            placeholder="Chase Bank"
            errorText={errors.bankName?.message}
            {...register("bankName")}
          />
          <Input
            label="Account Number"
            placeholder="1234567890"
            errorText={errors.accountNumber?.message}
            {...register("accountNumber")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Routing Number (optional)"
            placeholder="021000021"
            errorText={errors.routingNumber?.message}
            {...register("routingNumber")}
          />
          <Input
            label="Currency"
            placeholder="USD"
            errorText={errors.currency?.message}
            {...register("currency")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="IBAN (optional)"
            errorText={errors.iban?.message}
            {...register("iban")}
          />
          <Input
            label="SWIFT Code (optional)"
            errorText={errors.swiftCode?.message}
            {...register("swiftCode")}
          />
        </div>
      </form>
    </Modal>
  );
}