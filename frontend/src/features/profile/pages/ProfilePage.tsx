import { useState } from "react";
import { Home, Pencil, UserRound } from "lucide-react";
import { Button, ErrorState, Skeleton } from "@/shared/components";
import { PageHeader } from "@/shared/layout/components/Content/PageHeader";
import { useProfile, useUpdateProfile } from "../hooks";
import { ProfileAvatar, ProfileField } from "../components";
import { ProfileEditForm } from "./ProfileEditForm";

function formatMemberSince(date: string | null | undefined): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(parsed);
}

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: profile, isLoading, error, refetch } = useProfile();
  const updateProfile = useUpdateProfile();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile" subtitle="Manage your personal information" />
        <Skeleton className="h-56 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile" subtitle="Manage your personal information" />
        <ErrorState
          title="Failed to load profile"
          description="We couldn't fetch your profile right now."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (isEditing && profile) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile" subtitle="Edit your personal information" />
        <ProfileEditForm
          profile={profile}
          isPending={updateProfile.isPending}
          onSave={(payload) => {
            updateProfile.mutate(payload, {
              onSuccess: () => setIsEditing(false),
            });
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  const fullName =
    profile?.firstName || profile?.lastName
      ? `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim()
      : "No name set";
  const memberSince = formatMemberSince(profile?.createdAt);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        subtitle="Manage your personal information"
        actions={
          <Button variant="outline" leftIcon={<Pencil size={15} />} onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        }
      />

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border-default bg-surface-primary">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/15 via-transparent to-chart-3/10" />
          <div className="ff-dot-grid absolute inset-0 opacity-40" />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-primary/15 blur-3xl" />
        </div>

        <div className="relative flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <ProfileAvatar
            firstName={profile?.firstName}
            lastName={profile?.lastName}
            avatarUrl={profile?.avatarUrl}
            size="lg"
            className="ring-2 ring-brand-primary/30 ring-offset-2 ring-offset-surface-primary"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-text-primary">{fullName}</h2>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-border-subtle bg-bg-secondary/60 px-2.5 py-1 font-mono text-xs text-text-secondary">
                {profile?.userId}
              </span>
              {memberSince && (
                <span className="rounded-md border border-border-subtle bg-bg-secondary/60 px-2.5 py-1 text-xs text-text-tertiary">
                  Member since {memberSince}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Personal information */}
      <div className="rounded-2xl border border-border-default bg-surface-primary">
        <header className="flex items-center gap-2.5 border-b border-border-subtle px-6 py-4">
          <UserRound size={16} className="text-brand-primary" />
          <h3 className="text-sm font-semibold text-text-primary">Personal Information</h3>
        </header>
        <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProfileField label="First Name" value={profile?.firstName} />
          <ProfileField label="Last Name" value={profile?.lastName} />
          <ProfileField label="Date of Birth" value={profile?.dateOfBirth} />
        </div>
      </div>

      {/* Address */}
      <div className="rounded-2xl border border-border-default bg-surface-primary">
        <header className="flex items-center gap-2.5 border-b border-border-subtle px-6 py-4">
          <Home size={16} className="text-brand-primary" />
          <h3 className="text-sm font-semibold text-text-primary">Address</h3>
        </header>
        <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProfileField label="Address Line 1" value={profile?.addressLine1} />
          <ProfileField label="Address Line 2" value={profile?.addressLine2} />
          <ProfileField label="City" value={profile?.city} />
          <ProfileField label="State" value={profile?.state} />
          <ProfileField label="Postal Code" value={profile?.postalCode} />
          <ProfileField label="Country" value={profile?.country} />
        </div>
      </div>
    </div>
  );
}