import { useState } from "react";
import { Button, Input } from "@/shared/components";
import { ProfileAvatar } from "../components";
import type { UserProfile, UpdateProfilePayload } from "../types";

interface ProfileEditFormProps {
  profile: UserProfile;
  isPending: boolean;
  onSave: (payload: UpdateProfilePayload) => void;
  onCancel: () => void;
}

export function ProfileEditForm({
  profile,
  isPending,
  onSave,
  onCancel,
}: ProfileEditFormProps) {
  const [formData, setFormData] = useState<UpdateProfilePayload>({
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    dateOfBirth: profile.dateOfBirth ?? "",
    addressLine1: profile.addressLine1 ?? "",
    addressLine2: profile.addressLine2 ?? "",
    city: profile.city ?? "",
    state: profile.state ?? "",
    postalCode: profile.postalCode ?? "",
    country: profile.country ?? "",
    avatarUrl: profile.avatarUrl ?? "",
  });

  const handleChange = (field: keyof UpdateProfilePayload) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-border-secondary bg-surface-primary p-6">
        <div className="flex items-center gap-6 mb-6">
          <ProfileAvatar
            firstName={formData.firstName}
            lastName={formData.lastName}
            avatarUrl={formData.avatarUrl}
            size="lg"
          />
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Edit Profile</h2>
            <p className="text-sm text-text-tertiary">Update your personal information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={handleChange("firstName")}
            placeholder="Enter first name"
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange("lastName")}
            placeholder="Enter last name"
          />
          <Input
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange("dateOfBirth")}
          />
          <Input
            label="Avatar URL"
            value={formData.avatarUrl}
            onChange={handleChange("avatarUrl")}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border-secondary bg-surface-primary p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">Address</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Address Line 1"
              value={formData.addressLine1}
              onChange={handleChange("addressLine1")}
              placeholder="Street address"
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Address Line 2"
              value={formData.addressLine2}
              onChange={handleChange("addressLine2")}
              placeholder="Apt, suite, unit, etc."
            />
          </div>
          <Input
            label="City"
            value={formData.city}
            onChange={handleChange("city")}
            placeholder="City"
          />
          <Input
            label="State"
            value={formData.state}
            onChange={handleChange("state")}
            placeholder="State"
          />
          <Input
            label="Postal Code"
            value={formData.postalCode}
            onChange={handleChange("postalCode")}
            placeholder="Postal code"
          />
          <Input
            label="Country"
            value={formData.country}
            onChange={handleChange("country")}
            placeholder="Country code (e.g. US)"
            maxLength={2}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
