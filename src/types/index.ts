export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: string;
  addresses: Address[];
  isActive: boolean;
  createdAt: string;
}

export interface Address {
  _id?: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Variant {
  flavor?: string;
  weight?: string;
  sku: string;
  price: number;
  mrp: number;
  stock: number;
  images: string[];
}

export interface NutritionFact {
  label: string;
  per100g?: string;
  perServing?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: Category;
  brand: string;
  variants: Variant[];
  images: string[];
  tags: string[];
  nutritionFacts: NutritionFact[];
  ingredients?: string;
  howToUse?: string;
  benefits: string[];
  isFeatured: boolean;
  isActive: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CartItem {
  product: string;
  variantSku: string;
  flavor?: string;
  weight?: string;
  quantity: number;
  price: number;
  mrp: number;
  image: string;
  name: string;
}

export interface Cart {
  _id: string;
  items: CartItem[];
  coupon?: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  variantSku: string;
  flavor?: string;
  weight?: string;
  quantity: number;
  price: number;
  mrp: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'placed' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  discount: number;
  shippingCharge: number;
  total: number;
  couponCode?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  product: string;
  user: { _id: string; name: string; avatar?: string };
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination: PaginationMeta;
}
