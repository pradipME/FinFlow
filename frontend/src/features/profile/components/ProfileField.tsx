interface ProfileFieldProps {
  label: string;
  value?: string | null;
}

export function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-secondary/40 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wider text-text-tertiary">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-text-primary">{value || "\u2014"}</dd>
    </div>
  );
}