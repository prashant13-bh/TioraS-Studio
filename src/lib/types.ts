import type { StoreVibe } from './store-context';

export type ProductMedia = {
  type: "image" | "video";
  url: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "T-Shirt" | "Hoodie" | "Jacket" | "Cap";
  sizes: string[];
  colors: string[];
  media: ProductMedia[];
  isNew: boolean;
  vibe?: StoreVibe;
  stock?: number;
  sku?: string;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
};

export type Address = {
  id: string;
  userId: string;
  label: string; // e.g., "Home", "Work"
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
};

export type ShippingAddress = {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
  // Denormalized fields for easier display
  name: string;
  image: string;
};

export type Order = {
  id: string;
  userId: string;
  orderNumber: string;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  shippingAddr: ShippingAddress;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  itemCount: number;
};

export type Design = {
  id: string;
  name: string;
  prompt: string;
  product: string;
  imageUrl: string;
  status: "Draft" | "Approved" | "Rejected";
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type Category = "All" | "T-Shirt" | "Hoodie" | "Jacket" | "Cap";

export type SalesData = {
  name: string;
  total: number;
};

export type AdminDashboardData = {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  activeUsers: number;
  recentOrders: Order[];
  salesByDay: SalesData[];
};

export type UserProfile = {
  id: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  providerId?: string;
  createdAt: string;
  isAdmin?: boolean;
};

export type VendorProfile = {
  id: string; // Ties to UserProfile ID
  storeName: string;
  storeSlug: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  status: "Pending" | "Active" | "Suspended";
  contactEmail: string;
  contactPhone: string;
  address: Address;
  capabilities: {
    dtfPrinting: boolean;
    embroidery: boolean;
    cutAndSew: boolean;
  };
  metrics: {
    totalSales: number;
    totalOrders: number;
    rating: number;
    reviewCount: number;
  };
  payoutSettings: PayoutSettings;
  createdAt: string;
  updatedAt: string;
};

export type PayoutSettings = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  upiId?: string;
};
