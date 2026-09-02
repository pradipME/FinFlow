import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary-subtle text-brand-primary">
        <SearchX size={30} />
      </span>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary">Page not found</h1>
      <p className="mt-3 max-w-md text-text-secondary">
        The page you're looking for doesn't exist or has been moved. Double-check the address,
        or head back to the dashboard.
      </p>
      <Link
        to="/dashboard"
        className="mt-8 inline-flex h-10 items-center gap-2 rounded-button bg-brand-primary px-5 text-sm font-semibold text-bg-primary transition-colors hover:bg-brand-primary-hover"
      >
        <Home size={16} /> Back to dashboard
      </Link>
    </div>
  );
}