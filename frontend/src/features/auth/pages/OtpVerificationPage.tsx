import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { ROUTES } from "@/shared/constants";
import { Button, OTPInput, Alert } from "@/shared/components";

const UNSUPPORTED_MESSAGE =
  "OTP verification is not yet available. This feature requires backend endpoints that have not been implemented. Please contact support for assistance.";

export function OtpVerificationPage() {
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const handleComplete = useCallback(
    (value: string) => {
      setOtp(value);
      toast.error(UNSUPPORTED_MESSAGE, { duration: 8000 });
    },
    [],
  );

  function handleResend() {
    toast.error(UNSUPPORTED_MESSAGE, { duration: 8000 });
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary-subtle">
        <ShieldCheck className="h-8 w-8 text-brand-primary" />
      </div>

      <h1 className="text-2xl font-bold text-text-primary">
        Enter verification code
      </h1>
      <p className="mt-2 text-sm text-text-tertiary">
        Enter the 6-digit code sent to your email or phone.
      </p>

      <div className="mx-auto mt-6 max-w-sm">
        <Alert variant="warning" title="Feature Unavailable">
          OTP verification requires backend endpoints that have not been
          implemented yet. The OTP input below is for UI preview only.
        </Alert>
      </div>

      <div className="mt-6">
        <OTPInput
          length={6}
          value={otp}
          onChange={setOtp}
          onComplete={handleComplete}
          autoFocus
        />
      </div>

      <div className="mt-6 space-y-3">
        <Button
          onClick={handleResend}
          variant="outline"
          disabled={resendTimer > 0}
          className="mx-auto"
        >
          {resendTimer > 0
            ? `Resend code in ${resendTimer}s`
            : "Resend verification code"}
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