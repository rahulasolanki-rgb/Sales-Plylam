// API service for Timber & Plywood mobile app
// Handles authentication, products, cart, orders, invoices, profile
import { env } from "./config/env";

const API_BASE = env.API_BASE_URL;

let token: string | null = null;

function setToken(newToken: string) {
  token = newToken;
  localStorage.setItem('token', newToken);
}

function getToken() {
  if (!token) token = localStorage.getItem('token');
  return token;
}

function authHeaders() {
  return getToken() ? { Authorization: `Bearer ${getToken()}` } : {};
}

async function request(url: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders(),
    ...(options.headers || {})
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const apiService = {
    async registerCustomer(data: { business_name: string; address: string; contact_person: string; phone: string; gstin: string; type: string }) {
      return request(`${API_BASE}/register.php`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
  // Auth
  async login(data: { email: string; password: string; app_role?: string }) {
    const res = await request(`${API_BASE}/login.php`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    setToken(res.token);
    return res;
  },
  async logout() {
    await request(`${API_BASE}/logout.php`, { method: 'POST' });
    setToken('');
    localStorage.removeItem('token');
  },
  async refreshToken() {
    const res = await request(`${API_BASE}/token/refresh.php`, { method: 'POST' });
    setToken(res.token);
    return res;
  },
  async getMe() {
    return request(`${API_BASE}/me.php`);
  },
  async forgotPassword(email: string) {
    return request(`${API_BASE}/forgot-password.php`, {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },
  async resetPassword(token: string, new_password: string) {
    return request(`${API_BASE}/reset-password.php`, {
      method: 'POST',
      body: JSON.stringify({ token, new_password })
    });
  },

  // Products
  async getProducts(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`${API_BASE}/products.php${query ? '?' + query : ''}`);
  },

  // Cart
  async getCart() {
    return request(`${API_BASE}/cart.php`);
  },
  async addToCart(product_id: string, quantity: number) {
    return request(`${API_BASE}/cart.php`, {
      method: 'POST',
      body: JSON.stringify({ product_id, quantity })
    });
  },
  async removeFromCart(product_id: string) {
    return request(`${API_BASE}/cart.php?product_id=${product_id}`, {
      method: 'DELETE'
    });
  },
  async clearCart() {
    return request(`${API_BASE}/cart.php`, { method: 'DELETE' });
  },

  // Orders
  async checkout(shipping_address: string) {
    // Creates order from cart
    return request(`${API_BASE}/checkout.php`, {
      method: 'POST',
      body: JSON.stringify({ shipping_address })
    });
  },
  async createOrder(items: Array<{ product_id: string; quantity: number }>) {
    return request(`${API_BASE}/orders.php`, {
      method: 'POST',
      body: JSON.stringify({ items })
    });
  },
  async getOrders(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`${API_BASE}/orders.php${query ? '?' + query : ''}`);
  },
  async getOrder(id: string) {
    return request(`${API_BASE}/orders.php?id=${id}`);
  },

  // Invoices
  async getInvoices(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`${API_BASE}/invoices.php${query ? '?' + query : ''}`);
  },

  // Profile
  async getCustomerProfile() {
    return request(`${API_BASE}/customers.php?action=me`);
  },
  async updateProfile(data: Record<string, any>) {
    return request(`${API_BASE}/customers.php?action=update_profile`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },
  async changePassword(current_password: string, new_password: string) {
    return request(`${API_BASE}/customers.php?action=change_password`, {
      method: 'POST',
      body: JSON.stringify({ current_password, new_password })
    });
  },
  async createSubUser(data: Record<string, any>) {
    return request(`${API_BASE}/customers.php?action=create_sub_user`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Health
  async getHealth() {
    return request(`${API_BASE}/health.php`);
  }
};
