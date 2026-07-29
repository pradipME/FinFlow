import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/constants";

export function HomePage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col items-center justify-center gap-8 px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        Welcome to <span className="text-brand-primary">FinFlow</span>
      </h1>
      <p className="max-w-lg text-lg text-neutral-500">
        Enterprise-grade digital banking. Manage your finances with confidence.
      </p>
      <div className="flex gap-4">
        <Link
          to={ROUTES.LOGIN}
          className="rounded-button bg-brand-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-primary-light"
        >
          Sign in
        </Link>
        <Link
          to={ROUTES.REGISTER}
          className="rounded-button border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
