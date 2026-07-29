import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft, Lock } from "lucide-react";
import { ROUTES } from "@/shared/constants";
import { Button, Input, Alert } from "@/shared/components";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas";

const UNSUPPORTED_MESSAGE =
  "Password reset is not yet available. This feature requires backend integration that has not been implemented. Please contact support for assistance.";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  function onSubmit(_data: ResetPasswordFormData) {
    toast.error(UNSUPPORTED_MESSAGE, { duration: 8000 });
  }

  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-subtle">
          <AlertTriangle className="h-6 w-6 text-danger" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Invalid Link</h1>
        <p className="mt-2 text-sm text-text-tertiary">
          This password reset link is invalid or has expired.
        </p>
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="mt-4 inline-block text-sm font-medium text-brand-primary hover:text-brand-primary-hover"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning-subtle">
          <AlertTriangle className="h-6 w-6 text-warning" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">
          Reset your password
        </h1>
        <p className="mt-1 text-sm text-text-tertiary">
          Enter your new password below.
        </p>
      </div>

      <div className="mb-4">
        <Alert variant="warning" title="Feature Unavailable">
          Password reset functionality requires backend endpoints that have not
          been implemented yet. The form below is for UI preview only.
        </Alert>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            error={errors.password?.message}
            autoComplete="new-password"
            {...register("password")}
          />
          <Lock className="pointer-events-none absolute right-3 top-[38px] h-4 w-4 text-text-tertiary" />
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          <Lock className="pointer-events-none absolute right-3 top-[38px] h-4 w-4 text-text-tertiary" />
        </div>

        <Button type="submit" className="w-full">
          Reset password
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