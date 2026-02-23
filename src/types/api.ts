export type UserRole = "Customer" | "Sub-user" | "Sales Person";

export interface ApiEnvelope {
  success: boolean;
  message?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status?: string;
  customer_id?: number;
}

export interface LoginResponse extends ApiEnvelope {
  token: string;
  expires_in: number;
  user: AuthUser;
}

export interface Customer {
  id: number;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  outstandingBalance?: string;
}

export interface CustomerNote {
  id: number;
  customer_id: number;
  user_id: number;
  note: string;
  created_at: string;
}

export interface CustomerDetail extends Customer {
  notes: CustomerNote[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  priceUnit: string;
  stock?: number;
  stock_status?: string;
}

export interface Order {
  id: string;
  customer_id: number;
  customerName: string;
  status: string;
  order_date?: string;
  grand_total?: string;
}

export interface OrderItem {
  product_id: string;
  productName?: string;
  quantity: number;
  unitPrice?: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}

export interface Invoice {
  id: string;
  order_id: string;
  issue_date: string;
  due_date: string;
  grand_total: string;
  status: string;
  customer_name?: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: string;
  quantity: number;
  line_total: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface Pagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResult<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}
