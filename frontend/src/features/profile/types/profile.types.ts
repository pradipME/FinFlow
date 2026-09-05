export interface UserProfile {
  id: string;
  userId: string;
  phoneNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  avatarUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  avatarUrl?: string;
}
