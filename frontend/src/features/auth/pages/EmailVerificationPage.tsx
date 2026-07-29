import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { ROUTES } from "@/shared/constants";
import { Button, Alert } from "@/shared/components";

const UNSUPPORTED_MESSAGE =
  "Email verification is not yet available. This feature requires backend endpoints that have not been implemented. Please contact support for assistance.";

export function EmailVerificationPage() {
  function handleResend() {
    toast.error(UNSUPPORTED_MESSAGE, { duration: 8000 });
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary-subtle">
        <Mail className="h-8 w-8 text-brand-primary" />
      </div>

      <h1 className="text-2xl font-bold text-text-primary">
        Check your email
      </h1>
      <p className="mt-2 text-sm text-text-tertiary">
        We&apos;ve sent a verification link to your email address. Please check
        your inbox and click the link to verify your account.
      </p>

      <div className="mx-auto mt-6 max-w-sm">
        <Alert variant="warning" title="Feature Unavailable">
          Email verification requires backend endpoints that have not been
          implemented yet. The resend button below is for UI preview only.
        </Alert>
      </div>

      <div className="mt-6 space-y-3">
        <Button onClick={handleResend} variant="outline" className="mx-auto">
          <span className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Resend verification email
          </span>
        </Button>

        <div>
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-1.5 text-sm text-brand-primary hover:text-brand-primary-hover"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}