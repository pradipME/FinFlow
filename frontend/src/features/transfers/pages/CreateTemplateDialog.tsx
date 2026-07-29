import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components";
import { templateSchema, type TemplateFormData } from "../schemas";
import { useCreateTemplate } from "../hooks";
import type { AccountSummary } from "@/features/accounts/types";

interface CreateTemplateDialogProps {
  accounts: AccountSummary[];
  onClose: () => void;
}

export function CreateTemplateDialog({ accounts, onClose }: CreateTemplateDialogProps) {
  const createTemplate = useCreateTemplate();
  const { register, handleSubmit, formState: { errors } } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
  });

  const onSubmit = async (data: TemplateFormData) => {
    await createTemplate.mutateAsync({
      templateName: data.templateName,
      sourceAccountId: data.sourceAccountId,
      targetAccountId: data.targetAccountId || undefined,
      amountCents: data.amountCents,
      description: data.description || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Create Transfer Template</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Template Name</label>
            <input
              {...register("templateName")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="e.g. Monthly Rent"
            />
            {errors.templateName && <p className="mt-1 text-xs text-red-500">{errors.templateName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Source Account</label>
            <select {...register("sourceAccountId")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option value="">Select account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.accountNumber} ({a.accountType})</option>
              ))}
            </select>
            {errors.sourceAccountId && <p className="mt-1 text-xs text-red-500">{errors.sourceAccountId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (cents)</label>
            <input
              type="number"
              {...register("amountCents", { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            {errors.amountCents && <p className="mt-1 text-xs text-red-500">{errors.amountCents.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              {...register("description")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Optional"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={createTemplate.isPending}>
              {createTemplate.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
