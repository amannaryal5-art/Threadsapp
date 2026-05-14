import type { Address } from "@/types/user.types";

export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "return_picked"
  | "refunded";

export interface OrderItem {
  id: string;
  orderId?: string;
  productId: string;
  variantId: string;
  productName: string;
  variantDetails: {
    size: string;
    color: string;
    sku: string;
  };
  productImage?: string | null;
  quantity: number;
  mrp: number | string;
  sellingPrice: number | string;
  discountPercent: number;
  totalPrice: number | string;
}

export interface PaymentInfo {
  id: string;
  orderId: string;
  userId: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  amount: number | string;
  currency: string;
  status: string;
  method?: string | null;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt?: string | null;
  status: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  addressId: string;
  status: OrderStatus;
  paymentStatus: string;
  subtotal: number | string;
  discountAmount: number | string;
  couponCode?: string | null;
  couponDiscount: number | string;
  shippingCharge: number | string;
  taxAmount: number | string;
  totalAmount: number | string;
  trackingNumber?: string | null;
  courierName?: string | null;
  trackingUrl?: string | null;
  createdAt: string;
  deliveredAt?: string | null;
  invoiceUrl?: string | null;
  Address?: Address;
  items?: OrderItem[];
  payment?: PaymentInfo;
}

export interface TrackingEvent {
  activity: string;
  date: string;
  location?: string;
}

export interface TrackingResponse {
  order: Order;
  tracking: {
    awb_code?: string;
    courier_name?: string;
    shipment_track_activities?: TrackingEvent[];
  } | null;
}
