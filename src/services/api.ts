import { env } from "../config/env";
import type {
  ApiEnvelope,
  Cart,
  Customer,
  CustomerDetail,
  Invoice,
  LoginResponse,
  Order,
  OrderDetail,
  PaginatedResult,
  Product,
} from "../types/api";
import { http, setAccessToken } from "./httpClient";
import {
  mockCart,
  mockCustomerDetail,
  mockCustomers,
  mockInvoices,
  mockOrderDetail,
  mockOrders,
  mockProducts,
} from "./mockData";

const mockPagination = { page: 1, per_page: 20, total: 1, total_pages: 1 };

async function fromMock<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

export const portalApi = {
  async login(email: string, password: string, app_role = "Sales Person") {
    if (env.USE_MOCK_API) {
      const data: LoginResponse = {
        success: true,
        token: "mock-sales-token",
        expires_in: 3600,
        user: { id: 21, name: "Sales User", email, role: "Sales Person", status: "Active" },
      };
      setAccessToken(data.token);
      return fromMock(data);
    }

    const data = await http<LoginResponse>("/api/login.php", {
      method: "POST",
      body: JSON.stringify({ email, password, app_role }),
    });
    setAccessToken(data.token);
    return data;
  },

  logout() {
    if (env.USE_MOCK_API) return fromMock({ success: true, message: "Logged out successfully." });
    return http<ApiEnvelope>("/api/logout.php", { method: "POST" });
  },

  me() {
    if (env.USE_MOCK_API) {
      return fromMock({
        success: true,
        user: { id: 21, name: "Sales User", email: "sales@example.com", role: "Sales Person" },
      });
    }
    return http<{ success: boolean; user: unknown }>("/api/me.php");
  },

  getCustomers() {
    if (env.USE_MOCK_API) return fromMock(mockCustomers);
    return http<Customer[]>("/api/customers.php");
  },

  getCustomerById(id: number) {
    if (env.USE_MOCK_API) return fromMock({ ...mockCustomerDetail, id });
    return http<CustomerDetail>("/api/customers.php", { method: "GET" }, { id });
  },

  addCustomerNote(customer_id: number, note: string) {
    if (env.USE_MOCK_API) return fromMock({ success: true, message: "Note added." });
    return http<ApiEnvelope>("/api/customers.php", {
      method: "POST",
      body: JSON.stringify({ customer_id, note }),
    }, { action: "add_note" });
  },

  getOrders(scope?: "mine") {
    if (env.USE_MOCK_API) {
      return fromMock({ success: true, data: mockOrders, pagination: mockPagination } as PaginatedResult<Order>);
    }
    return http<PaginatedResult<Order>>("/api/orders.php", { method: "GET" }, { scope });
  },

  getOrderById(id: string) {
    if (env.USE_MOCK_API) return fromMock({ ...mockOrderDetail, id });
    return http<OrderDetail>("/api/orders.php", { method: "GET" }, { id });
  },

  getInvoices(customer_id?: number) {
    if (env.USE_MOCK_API) return fromMock(mockInvoices);
    return http<Invoice[]>("/api/invoices.php", { method: "GET" }, { customer_id });
  },

  getProducts(params?: Record<string, string | number | undefined>) {
    if (env.USE_MOCK_API) {
      return fromMock({ success: true, data: mockProducts, pagination: mockPagination } as PaginatedResult<Product>);
    }
    return http<PaginatedResult<Product>>("/api/products.php", { method: "GET" }, params);
  },

  getCart() {
    if (env.USE_MOCK_API) return fromMock(mockCart);
    return http<Cart>("/api/cart.php", { method: "GET" });
  },

  updateCart(product_id: string, quantity: number) {
    if (env.USE_MOCK_API) return fromMock({ success: true, message: "Cart updated successfully." });
    return http<ApiEnvelope>("/api/cart.php", {
      method: "POST",
      body: JSON.stringify({ product_id, quantity }),
    });
  },

  createOrder(items: Array<{ product_id: string; quantity: number }>) {
    if (env.USE_MOCK_API) {
      return fromMock({
        success: true,
        message: "Order created successfully.",
        order_id: "ORD-MOCK-0001",
        amount: 32500,
      });
    }
    return http<{ success: boolean; message: string; order_id: string; amount: number }>("/api/orders.php", {
      method: "POST",
      body: JSON.stringify({ items }),
    });
  },

  checkout() {
    if (env.USE_MOCK_API) {
      return fromMock({
        success: true,
        message: "Checkout completed successfully.",
        order_id: "ORD-MOCK-0002",
        amount: 25000,
      });
    }
    return http<{ success: boolean; message: string; order_id: string; amount: number }>("/api/checkout.php", {
      method: "POST",
    });
  },

  updateProfile(payload: { name?: string; phone?: string; contactPerson?: string; email?: string; address?: string }) {
    if (env.USE_MOCK_API) return fromMock({ success: true, message: "Profile updated successfully." });
    return http<ApiEnvelope>("/api/customers.php", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }, { action: "update_profile" });
  },

  changePassword(current_password: string, new_password: string) {
    if (env.USE_MOCK_API) {
      return fromMock({ success: true, message: "Password changed successfully. Please login again." });
    }
    return http<ApiEnvelope>("/api/customers.php", {
      method: "POST",
      body: JSON.stringify({ current_password, new_password }),
    }, { action: "change_password" });
  },

  health() {
    if (env.USE_MOCK_API) {
      return fromMock({ success: true, status: "ok", api_version: "mock", database: "up" });
    }
    return http<{ success: boolean; status: string; api_version: string; database: string }>("/api/health.php");
  },
};
