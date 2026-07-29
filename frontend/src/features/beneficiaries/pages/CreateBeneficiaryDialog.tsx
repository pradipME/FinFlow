import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input, Button } from "@/shared/components";
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

  if (!open) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border-default bg-bg-primary p-6 shadow-elevation-xl">
        <h2 className="text-lg font-semibold text-text-primary">
          {isEditing ? "Edit Beneficiary" : "Add Beneficiary"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            errorText={errors.beneficiaryName?.message}
            {...register("beneficiaryName")}
          />
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

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? "Save Changes" : "Add Beneficiary"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
