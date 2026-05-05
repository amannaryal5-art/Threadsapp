import type { ProductImage } from "@/types/product.types";

export interface Address {
  id: string;
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
}

export interface OrderUser {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  profilePhoto?: string | null;
}

export interface OrderItem {
  id: string;
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
  mrp: string | number;
  sellingPrice: string | number;
  discountPercent: number;
  totalPrice: string | number;
}

export interface PaymentInfo {
  id: string;
  orderId: string;
  userId: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  amount: string | number;
  currency: string;
  status: string;
  method?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  addressId: string;
  status: string;
  paymentStatus: string;
  subtotal: string | number;
  discountAmount: string | number;
  couponCode?: string | null;
  couponDiscount: string | number;
  shippingCharge: string | number;
  taxAmount: string | number;
  totalAmount: string | number;
  trackingNumber?: string | null;
  courierName?: string | null;
  trackingUrl?: string | null;
  createdAt: string;
  deliveredAt?: string | null;
  invoiceUrl?: string | null;
  User?: OrderUser;
  Address?: Address;
  items?: OrderItem[];
  payment?: PaymentInfo;
}
