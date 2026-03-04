export type UserRole = "Customer" | "Sub-user" | "Sales Person" | "Manager" | "Admin / Owner" | "Super Admin";

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
  legalName?: string;
  gstin?: string;
  address?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  type?: "Dealer" | "Retailer";
  creditLimit?: string;
  outstandingBalance?: string;
  status?: "Approved" | "Pending Approval";
  sales_person_id?: number;
  created_at?: string;
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
  category?: string;
  category_id?: number;
  price: string;
  priceUnit?: string;
  stock?: number;
  status?: "Active" | "Inactive";
  gstRate?: number;
  reorderLevel?: number;
}

export interface Order {
  id: string;
  customer_id: number;
  customerName?: string;
  order_date?: string;
  amount?: string | number;
  status: "Created" | "Accepted" | "Approved" | "Invoiced" | "Dispatched" | "Completed" | "Cancelled";
  paymentStatus?: "Credit" | "Paid";
  sales_person_id?: number;
  salesPerson?: string;
}

export interface OrderItem {
  id?: number;
  order_id: string;
  product_id: string;
  productName?: string;
  quantity: number;
  unitPrice?: string | number;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}

export interface Invoice {
  id: string;
  order_id: string;
  customer_id?: number;
  issue_date?: string;
  due_date?: string;
  sub_total?: string | number;
  cgst?: string | number;
  sgst?: string | number;
  grand_total: string | number;
  status: "Paid" | "Due" | "Overdue";
  customerName?: string;
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
