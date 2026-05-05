import type { Address } from "@/types/order.types";

export interface User {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  profilePhoto?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  isActive: boolean;
  role: string;
  loyaltyPoints: number;
  createdAt: string;
  addresses?: Address[];
}
