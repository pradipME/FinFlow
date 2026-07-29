interface ProfileFieldProps {
  label: string;
  value?: string | null;
}

export function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="space-y-1">
      <dt className="text-sm font-medium text-text-tertiary">{label}</dt>
      <dd className="text-sm text-text-primary">{value || "\u2014"}</dd>
    </div>
  );
}
