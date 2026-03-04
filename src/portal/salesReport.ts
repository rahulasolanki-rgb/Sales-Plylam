import type { Invoice, Order } from "../types/api";

export interface SalesReportSnapshot {
  totalOrders: number;
  totalPendingOrders: number;
  totalRevenue: number;
  unpaidInvoices: number;
}

export function buildSalesReport(orders: Order[], invoices: Invoice[]): SalesReportSnapshot {
  const totalOrders = orders.length;
  const totalPendingOrders = orders.filter((x) => ["created", "accepted", "approved", "invoiced", "dispatched"].includes(x.status.toLowerCase())).length;
  const totalRevenue = orders.reduce((acc, x) => acc + Number(x.amount ?? 0), 0);
  const unpaidInvoices = invoices.filter((x) => ["due", "overdue"].includes(x.status.toLowerCase())).length;

  return {
    totalOrders,
    totalPendingOrders,
    totalRevenue,
    unpaidInvoices,
  };
}
