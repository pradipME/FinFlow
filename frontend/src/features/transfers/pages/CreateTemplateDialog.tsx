import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button, Input, Modal, Select } from "@/shared/components";
import { templateSchema, type TemplateFormData } from "../schemas";
import { useCreateTemplate } from "../hooks";
import type { AccountSummary } from "@/features/accounts/types";

interface CreateTemplateDialogProps {
  accounts: AccountSummary[];
  onClose: () => void;
  open?: boolean;
}

export function CreateTemplateDialog({ accounts, onClose, open = true }: CreateTemplateDialogProps) {
  const createTemplate = useCreateTemplate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
  });

  const onSubmit = async (data: TemplateFormData) => {
    try {
      await createTemplate.mutateAsync({
        templateName: data.templateName,
        sourceAccountId: data.sourceAccountId,
        targetAccountId: data.targetAccountId || undefined,
        amountCents: Math.round(data.amountCents * 100),
        description: data.description || undefined,
      });
      toast.success("Transfer template created");
      reset();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create template");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Transfer Template"
      description="Save a transfer you can repeat anytime."
      footer={
        <>
          <Button variant="neutral" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="template-form" isLoading={createTemplate.isPending}>
            {createTemplate.isPending ? "Creating..." : "Create Template"}
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
              label: `${a.accountNumber} (${a.accountType})`,
            })),
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
          placeholder="Optional"
          errorText={errors.description?.message}
          {...register("description")}
        />
      </form>
    </Modal>
  );
}