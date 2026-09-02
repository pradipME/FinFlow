import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useReducedMotion, fadeUp, pageFade } from "@/shared/motion";
import { Shield, Zap, BarChart3 } from "lucide-react";
import { BrandMark } from "./AppShell";

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
    description: "Real-time insights built from your actual transaction history.",
  },
];

export function AuthLayout({ children }: AuthLayoutProps): ReactNode {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-bg-primary">
      {/* Aurora + grid depth background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
        <div className="ff-dot-grid absolute inset-0 opacity-60" />
      </div>

      {/* Left brand panel (hidden on mobile) */}
      <div className="relative z-10 hidden w-1/2 items-center justify-center lg:flex xl:w-[55%]">
        <motion.div
          className="max-w-md px-12"
          initial={prefersReduced ? false : "hidden"}
          animate="visible"
          variants={pageFade}
        >
          <Link to="/" className="mb-12 inline-flex items-center gap-3">
            <BrandMark size={40} />
            <span className="text-2xl font-bold tracking-tight text-text-primary">FinFlow</span>
          </Link>

          <h2 className="mb-4 text-4xl font-bold leading-[1.1] tracking-tight text-text-primary">
            Enterprise-grade
            <br />
            <span className="text-gradient-primary">digital banking</span>
          </h2>
          <p className="mb-10 text-lg text-text-secondary">
            A modern command center for your money — secure, fast, and effortlessly clear.
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
                          transition: { delay: 0.15 + i * 0.15 },
                        },
                      }
                }
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface-secondary/70 text-brand-primary backdrop-blur-sm">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{feature.title}</h3>
                  <p className="mt-0.5 text-sm text-text-tertiary">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-6 border-t border-border-subtle pt-6 text-sm">
            <div>
              <p className="font-mono text-lg font-semibold text-text-primary">24/7</p>
              <p className="text-xs text-text-tertiary">Always on</p>
            </div>
            <div>
              <p className="font-mono text-lg font-semibold text-text-primary">99.9%</p>
              <p className="text-xs text-text-tertiary">Uptime target</p>
            </div>
            <div>
              <p className="font-mono text-lg font-semibold text-text-primary">256-bit</p>
              <p className="text-xs text-text-tertiary">Encryption</p>
            </div>
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
          <div className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <BrandMark size={32} />
            <Link to="/" className="text-2xl font-bold tracking-tight text-text-primary">
              FinFlow
            </Link>
          </div>

          {/* Glass card */}
          <div className="glass-card rounded-2xl p-8 shadow-elevation-xl">{children}</div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-text-tertiary">
            By continuing, you agree to FinFlow&apos;s Terms and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}