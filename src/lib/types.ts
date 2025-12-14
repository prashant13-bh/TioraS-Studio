

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  isNew: boolean;
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
    product: Product;
};

export type Order = {
    id: string;
    userId: string;
    orderNumber: string;
    total: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
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
    status: 'Draft' | 'Approved' | 'Rejected';
    createdAt: string;
    updatedAt: string;
    userId: string;
};


export type Category = 'All' | 'T-Shirt' | 'Hoodie' | 'Jacket' | 'Cap';

export type AdminDashboardData = {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  activeUsers: number;
  recentOrders: Order[];
};

export type UserProfile = {
  id: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  providerId: string;
  createdAt: string;
};
