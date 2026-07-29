import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/shared/constants";
import { Button, Input, Alert } from "@/shared/components";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../schemas";

const UNSUPPORTED_MESSAGE =
  "Password reset is not yet available. This feature requires backend integration that has not been implemented. Please contact support for assistance.";

export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  function onSubmit(_data: ForgotPasswordFormData) {
    toast.error(UNSUPPORTED_MESSAGE, { duration: 8000 });
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning-subtle">
          <AlertTriangle className="h-6 w-6 text-warning" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">
          Forgot your password?
        </h1>
        <p className="mt-1 text-sm text-text-tertiary">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <div className="mb-4">
        <Alert variant="warning" title="Feature Unavailable">
          Password reset functionality requires backend endpoints that have not
          been implemented yet. The form below is for UI preview only.
        </Alert>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          autoComplete="email"
          {...register("email")}
        />

        <Button type="submit" className="w-full">
          Send reset link
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-sm text-brand-primary hover:text-brand-primary-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}