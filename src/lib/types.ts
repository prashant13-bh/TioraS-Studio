import type { Product as PrismaProduct, Order as PrismaOrder, OrderItem as PrismaOrderItem, Design as PrismaDesign } from '@prisma/client';

export type Product = Omit<PrismaProduct, 'sizes' | 'colors'> & {
  sizes: string[];
  colors: string[];
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

export type ShippingAddress = {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
};

export type OrderItem = PrismaOrderItem & {
  product: Product;
};

export type Order = Omit<PrismaOrder, 'shippingAddr'> & {
  items: OrderItem[];
  shippingAddr: ShippingAddress;
};

export type Design = PrismaDesign;

export type Category = 'All' | 'T-Shirt' | 'Hoodie' | 'Jacket' | 'Cap';

export type AdminDashboardData = {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  activeUsers: number; // For now, we'll mock this.
  recentOrders: Order[];
};
