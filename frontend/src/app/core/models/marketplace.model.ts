export interface Product {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  price: number;
  brand: string;
  size: string;
  condition: string;
  category?: string;
  image?: string;
  images?: string[];
  variants?: any[];
  sellerId?: string;
  sellerName?: string;
  slug?: string;
  isActive?: boolean;
  deletedAt?: string | Date | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  avatar?: string;
  isActive: boolean;
  city?: string;
  productsCount: number;
  salesCount: number;
  rating: number;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  isActive: boolean;
  itemCount: number;
  featured: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  itemCount: number;
  isActive: boolean;
  parent?: string | null;
  createdAt: string;
}

export interface Condition {
  id: string;
  name: string;
  slug: string;
  description: string;
  badgeColor: string;
  isActive: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  brand: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  sellerName: string;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  isActive: boolean; // para moderación / auditoría
  createdAt: string;
  paymentMethod: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalUsers: number;
  totalBrands: number;
  totalCategories: number;
  totalOrders: number;
  totalSalesVolume: number;
  pendingOrders: number;
}

