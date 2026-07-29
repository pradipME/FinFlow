import { useState } from "react";
import { Button, ErrorState, Skeleton } from "@/shared/components";
import { PageHeader } from "@/shared/layout/components/Content/PageHeader";
import { useProfile, useUpdateProfile } from "../hooks";
import { ProfileAvatar, ProfileField } from "../components";
import { ProfileEditForm } from "./ProfileEditForm";

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: profile, isLoading, error, refetch } = useProfile();
  const updateProfile = useUpdateProfile();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Profile" subtitle="Manage your personal information" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <PageHeader title="Profile" subtitle="Manage your personal information" />
        <ErrorState
          description="Failed to load profile"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (isEditing && profile) {
    return (
      <div className="space-y-4">
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        subtitle="Manage your personal information"
        actions={
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        }
      />

      <div className="rounded-xl border border-border-secondary bg-surface-primary p-6">
        <div className="flex items-center gap-6">
          <ProfileAvatar
            firstName={profile?.firstName}
            lastName={profile?.lastName}
            avatarUrl={profile?.avatarUrl}
            size="lg"
          />
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {profile?.firstName || profile?.lastName
                ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
                : "No name set"}
            </h2>
            <p className="text-sm text-text-tertiary">{profile?.userId}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border-secondary bg-surface-primary p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">Personal Information</h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProfileField label="First Name" value={profile?.firstName} />
          <ProfileField label="Last Name" value={profile?.lastName} />
          <ProfileField label="Date of Birth" value={profile?.dateOfBirth} />
        </dl>
      </div>

      <div className="rounded-xl border border-border-secondary bg-surface-primary p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">Address</h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProfileField label="Address Line 1" value={profile?.addressLine1} />
          <ProfileField label="Address Line 2" value={profile?.addressLine2} />
          <ProfileField label="City" value={profile?.city} />
          <ProfileField label="State" value={profile?.state} />
          <ProfileField label="Postal Code" value={profile?.postalCode} />
          <ProfileField label="Country" value={profile?.country} />
        </dl>
      </div>
    </div>
  );
}
