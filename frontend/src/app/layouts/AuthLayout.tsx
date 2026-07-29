import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useReducedMotion, fadeUp, pageFade } from "@/shared/motion";
import { Shield, Zap, BarChart3 } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

const features = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "End-to-end encryption with multi-factor authentication.",
  },
  {
    icon: Zap,
    title: "Instant Transfers",
    description: "Send and receive money in real-time, 24/7.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "AI-powered insights into your spending habits.",
  },
];

export function AuthLayout({ children }: AuthLayoutProps): ReactNode {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-bg-primary">
      {/* Aurora gradient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
      </div>

      {/* Left brand panel (hidden on mobile) */}
      <div className="relative z-10 hidden w-1/2 items-center justify-center lg:flex xl:w-[55%]">
        <motion.div
          className="max-w-md px-12"
          initial={prefersReduced ? false : "hidden"}
          animate="visible"
          variants={pageFade}
        >
          <Link to="/" className="mb-12 inline-block">
            <span className="text-3xl font-bold text-brand-primary">
              FinFlow
            </span>
          </Link>

          <h2 className="mb-4 text-3xl font-bold leading-tight text-text-primary">
            Enterprise-grade
            <br />
            digital banking
          </h2>
          <p className="mb-10 text-lg text-text-secondary">
            Manage your finances with confidence. Secure, fast, and intuitive.
          </p>

          <div className="space-y-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="flex items-start gap-4"
                initial={prefersReduced ? false : "hidden"}
                animate="visible"
                variants={
                  prefersReduced
                    ? undefined
                    : {
                        ...fadeUp,
                        visible: {
                          ...fadeUp.visible,
                          transition: { delay: 0.2 + i * 0.15 },
                        },
                      }
                }
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary-subtle text-brand-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-text-tertiary">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right content panel */}
      <div className="relative z-10 flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 xl:w-[45%]">
        <motion.div
          className="w-full max-w-md"
          initial={prefersReduced ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
        >
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <Link
              to="/"
              className="inline-block text-2xl font-bold text-brand-primary"
            >
              FinFlow
            </Link>
          </div>

          {/* Glass card */}
          <div className="glass-card rounded-xl p-8">
            {children}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-text-tertiary">
            By continuing, you agree to FinFlow's{" "}
            <span className="underline hover:text-text-secondary">Terms</span>{" "}
            and{" "}
            <span className="underline hover:text-text-secondary">
              Privacy Policy
            </span>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}