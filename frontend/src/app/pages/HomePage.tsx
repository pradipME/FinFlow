import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { ROUTES } from "@/shared/constants";
import { useReducedMotion, fadeUp } from "@/shared/motion";

const perks = [
  { icon: ShieldCheck, label: "Bank-grade security" },
  { icon: Zap, label: "Instant transfers" },
  { icon: BarChart3, label: "Real-time analytics" },
];

export function HomePage() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
        <div className="ff-dot-grid absolute inset-0 opacity-50" />
      </div>

      <motion.div
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center"
        initial={prefersReduced ? false : "hidden"}
        animate="visible"
        variants={fadeUp}
      >
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary-subtle px-4 py-1.5 text-xs font-medium text-brand-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-primary" />
          </span>
          Welcome to FinFlow
        </span>

        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-6xl">
          Enterprise-grade
          <br />
          <span className="text-gradient-primary">digital banking</span>
        </h1>

        <p className="mt-6 max-w-lg text-base text-text-secondary sm:text-lg">
          Manage your accounts, move money instantly, and understand your finances with
          real-time insights — all in one place.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={ROUTES.DASHBOARD}
            className="rounded-button bg-brand-primary px-6 py-3 text-sm font-semibold text-bg-primary transition-all duration-200 hover:bg-brand-primary-hover hover:shadow-elevation-md"
          >
            Go to Dashboard
          </Link>
          <Link
            to={ROUTES.ACCOUNTS}
            className="rounded-button border border-border-default bg-surface-secondary/80 px-6 py-3 text-sm font-medium text-text-primary backdrop-blur-sm transition-colors duration-200 hover:border-brand-primary/40 hover:bg-surface-secondary"
          >
            View Accounts
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {perks.map((perk) => (
            <span
              key={perk.label}
              className="flex items-center gap-2 text-xs font-medium text-text-tertiary"
            >
              <perk.icon size={14} className="text-brand-primary" />
              {perk.label}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}