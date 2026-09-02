import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button, Input, Modal, Select } from "@/shared/components";
import { templateSchema, type TemplateFormData } from "../schemas";
import { useCreateTemplate, useUpdateTemplate } from "../hooks";
import { useBeneficiaries } from "@/features/beneficiaries/hooks";
import type { AccountSummary } from "@/features/accounts/types";
import type { TransferTemplate } from "../types";
import { toErrorMessage } from "@/shared/lib";

interface CreateTemplateDialogProps {
  accounts: AccountSummary[];
  onClose: () => void;
  open?: boolean;
  /** When provided, dialog edits an existing template instead of creating one. */
  existing?: TransferTemplate | null;
}

export function CreateTemplateDialog({ accounts, onClose, open = true, existing = null }: CreateTemplateDialogProps) {
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const { data: beneficiariesData } = useBeneficiaries();
  const beneficiaries = beneficiariesData?.content ?? [];
  const isEdit = existing !== null;

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      templateName: existing?.templateName ?? "",
      sourceAccountId: existing?.sourceAccountId ?? "",
      targetAccountId: existing?.targetAccountId ?? "",
      targetBeneficiaryId: existing?.targetBeneficiaryId ?? "",
      amountCents: existing ? existing.amountCents / 100 : 0,
      description: existing?.description ?? "",
    },
  });

  const sourceAccount = accounts.find((a) => a.id === watch("sourceAccountId"));

  const onSubmit = async (data: TemplateFormData) => {
    try {
      const payload = {
        templateName: data.templateName,
        sourceAccountId: data.sourceAccountId,
        targetAccountId: data.targetAccountId || undefined,
        targetBeneficiaryId: data.targetBeneficiaryId || undefined,
        amountCents: Math.round(data.amountCents * 100),
        currency: sourceAccount?.currency,
        description: data.description || undefined,
      };
      if (isEdit && existing) {
        await updateTemplate.mutateAsync({ id: existing.id, payload });
        toast.success("Transfer template updated");
      } else {
        await createTemplate.mutateAsync(payload);
        toast.success("Transfer template created");
      }
      reset();
      onClose();
    } catch (err) {
      toast.error(toErrorMessage(err));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Transfer Template" : "Create Transfer Template"}
      description={isEdit ? "Update your saved transfer." : "Save a transfer you can repeat anytime."}
      footer={
        <>
          <Button variant="neutral" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="template-form" isLoading={createTemplate.isPending || updateTemplate.isPending}>
            {isEdit
              ? updateTemplate.isPending
                ? "Saving..."
                : "Save Changes"
              : createTemplate.isPending
                ? "Creating..."
                : "Create Template"}
          </Button>
        </>
      }
    >
      <form id="template-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Template Name"
          placeholder="e.g. Monthly Rent"
          errorText={errors.templateName?.message}
          {...register("templateName")}
        />
        <Select
          label="Source Account"
          {...register("sourceAccountId")}
          error={errors.sourceAccountId?.message}
          options={[
            { value: "", label: "Select account..." },
            ...accounts.map((a) => ({
              value: a.id,
              label: `${a.nickname ?? a.accountNumber} (${a.currency})`,
            })),
          ]}
        />
        <Select
          label="Target Account (optional)"
          {...register("targetAccountId")}
          error={errors.targetAccountId?.message}
          options={[
            { value: "", label: "No target account" },
            ...accounts
              .filter((a) => a.id !== watch("sourceAccountId"))
              .map((a) => ({
                value: a.id,
                label: `${a.nickname ?? a.accountNumber} (${a.currency})`,
              })),
          ]}
        />
        <Select
          label="Beneficiary (optional)"
          {...register("targetBeneficiaryId")}
          error={errors.targetBeneficiaryId?.message}
          options={[
            { value: "", label: "No beneficiary" },
            ...beneficiaries.map((b) => ({
              value: b.id,
              label: `${b.nickname ?? b.beneficiaryName} (${b.currency})`,
            })),
          ]}
        />
        <Input
          label={`Amount (${sourceAccount?.currency ?? "USD"})`}
          type="number"
          step="0.01"
          min="0.01"
          errorText={errors.amountCents?.message}
          {...register("amountCents", { valueAsNumber: true })}
        />
        <Input
          label="Description (optional)"
          placeholder="Optional"
          errorText={errors.description?.message}
          {...register("description")}
        />
      </form>
    </Modal>
  );
}