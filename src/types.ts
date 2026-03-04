export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  gst_number?: string;
  phone?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock_status: string;
  stock_quantity: number;
  description: string;
}

export interface CartItem {
  product_id: string;
  quantity: number;
  name: string;
  price: number;
  unit: string;
}

export interface Order {
  id: string;
  user_id: number;
  customerName?: string;
  status: string;
  amount: number;
  created_at: string;
  shipping_address: string;
  items?: OrderItem[];
}

export interface OrderItem {
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  name?: string;
  unit?: string;
}

export interface Invoice {
  id: string;
  order_id: string;
  user_id: number;
  amount: number;
  status: string;
  created_at: string;
}
