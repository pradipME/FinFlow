import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserPlus, Eye, EyeOff, Check, X } from "lucide-react";
import { ROUTES } from "@/shared/constants";
import { Button, Input } from "@/shared/components";
import { useAuth } from "../hooks";
import { registerSchema, type RegisterFormData } from "../schemas";

const passwordRules = [
  { test: (p: string) => p.length >= 8, label: "At least 8 characters" },
  { test: (p: string) => /[A-Z]/.test(p), label: "One uppercase letter" },
  { test: (p: string) => /[a-z]/.test(p), label: "One lowercase letter" },
  { test: (p: string) => /[0-9]/.test(p), label: "One digit" },
  {
    test: (p: string) => /[@#$%^&+=!]/.test(p),
    label: "One special character (@#$%^&+=!)",
  },
];

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      termsAccepted: false,
    },
  });

  const passwordValue = useWatch({ control, name: "password" });

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerUser({
        email: data.email,
        username: data.username,
        password: data.password,
        phoneNumber: data.phoneNumber || undefined,
        termsAccepted: data.termsAccepted,
      });
      toast.success("Account created! You can now sign in.");
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      toast.error(message);
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-text-primary">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-text-tertiary">
          Start managing your finances today.
        </p>
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

        <Input
          label="Username"
          placeholder="Choose a username"
          error={errors.username?.message}
          autoComplete="username"
          {...register("username")}
        />

        <Input
          label="Phone Number (optional)"
          type="tel"
          placeholder="+1234567890"
          error={errors.phoneNumber?.message}
          autoComplete="tel"
          {...register("phoneNumber")}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            error={errors.password?.message}
            autoComplete="new-password"
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

        {passwordValue && (
          <div className="space-y-1">
            {passwordRules.map((rule) => (
              <div
                key={rule.label}
                className="flex items-center gap-1.5 text-xs"
              >
                {rule.test(passwordValue) ? (
                  <Check className="h-3 w-3 text-success" />
                ) : (
                  <X className="h-3 w-3 text-text-disabled" />
                )}
                <span
                  className={
                    rule.test(passwordValue) ? "text-success" : "text-text-disabled"
                  }
                >
                  {rule.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-[38px] text-text-tertiary hover:text-text-secondary"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-border-default text-brand-primary focus:ring-brand-primary"
            {...register("termsAccepted")}
          />
          <span className="text-sm text-text-secondary">
            I agree to the{" "}
            <span className="underline hover:text-text-primary">Terms</span>{" "}
            and{" "}
            <span className="underline hover:text-text-primary">
              Privacy Policy
            </span>
          </span>
        </label>
        {errors.termsAccepted && (
          <p className="text-xs text-danger">{errors.termsAccepted.message}</p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Creating account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create account
            </span>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-tertiary">
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-brand-primary hover:text-brand-primary-hover"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}