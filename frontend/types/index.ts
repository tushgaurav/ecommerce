export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  inventory_count: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  total_price: string;
  created_at: string;
}

export interface Order {
  id: number;
  total_amount: string;
  status: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface ApiResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface Address {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}
