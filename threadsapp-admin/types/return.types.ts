import type { Order, OrderItem, OrderUser } from "@/types/order.types";

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderItemId: string;
  userId: string;
  reason: string;
  description?: string | null;
  photos: string[];
  status: string;
  refundAmount?: string | number | null;
  adminNotes?: string | null;
  createdAt: string;
  Order?: Order;
  OrderItem?: OrderItem;
  User?: OrderUser;
}
