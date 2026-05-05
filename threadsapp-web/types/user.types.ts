export interface User {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say" | null;
  dateOfBirth?: string | null;
  profilePhoto?: string | null;
  loyaltyPoints?: number;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
}

export interface Address {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  flatNo?: string | null;
  building?: string | null;
  street?: string | null;
  area?: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  type: "home" | "work" | "other";
  isDefault: boolean;
  lat?: number | null;
  lng?: number | null;
}

export interface LoyaltyPointsResponse {
  balance: number;
  history: Array<{
    type: string;
    points: number;
    description: string;
  }>;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: "order" | "payment" | "offer" | "system";
  data: Record<string, string | number | boolean | null>;
  isRead: boolean;
  createdAt?: string;
}
