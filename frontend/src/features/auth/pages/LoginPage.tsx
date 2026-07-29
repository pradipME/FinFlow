import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { ROUTES } from "@/shared/constants";
import { Button, Input } from "@/shared/components";
import { useAuth } from "../hooks";
import { loginSchema, type LoginFormData } from "../schemas";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const returnTo =
    (location.state as { returnTo?: string } | null)?.returnTo ??
    ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data);
      toast.success("Welcome back!");
      navigate(returnTo, { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      toast.error(message);
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-text-primary">
          Sign in to FinFlow
        </h1>
        <p className="mt-1 text-sm text-text-tertiary">
          Welcome back! Please enter your credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email or Username"
          placeholder="you@example.com or username"
          error={errors.identifier?.message}
          autoComplete="username"
          {...register("identifier")}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            error={errors.password?.message}
            autoComplete="current-password"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-text-tertiary hover:text-text-secondary"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border-default text-brand-primary focus:ring-brand-primary"
            />
            Remember me
          </label>
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm text-brand-primary hover:text-brand-primary-hover"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign in
            </span>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-tertiary">
        Don&apos;t have an account?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-brand-primary hover:text-brand-primary-hover"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}