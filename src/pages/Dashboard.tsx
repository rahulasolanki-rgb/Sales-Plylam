import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiProxy } from "../apiProxy";

export default function Dashboard() {
  const [summary, setSummary] = useState({ orders: 0, customers: 0, invoices: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [ordersRes, customersRes, invoicesRes] = await Promise.all([
          apiProxy.getOrders?.({ scope: "mine" as any }) ?? apiProxy.getOrders?.(),
          apiProxy.getCustomers?.(),
          apiProxy.getInvoices?.(),
        ]);
        const orders = Array.isArray(ordersRes) ? ordersRes : (ordersRes?.data ?? []);
        const customers = Array.isArray(customersRes) ? customersRes : (customersRes?.data ?? []);
        const invoices = Array.isArray(invoicesRes) ? invoicesRes : (invoicesRes?.data ?? []);
        setSummary({ orders: orders.length, customers: customers.length, invoices: invoices.length });
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-black">Sales Dashboard</h1>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border"><p className="text-xs">My Orders</p><p className="text-2xl font-black">{summary.orders}</p></div>
        <div className="bg-white rounded-2xl p-4 border"><p className="text-xs">Customers</p><p className="text-2xl font-black">{summary.customers}</p></div>
        <div className="bg-white rounded-2xl p-4 border"><p className="text-xs">Invoices</p><p className="text-2xl font-black">{summary.invoices}</p></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/orders/new" className="bg-primary text-white p-4 rounded-xl font-semibold text-center">Create Order</Link>
        <Link to="/cart" className="bg-white p-4 rounded-xl border text-center font-semibold">Cart</Link>
        <Link to="/customers" className="bg-white p-4 rounded-xl border text-center font-semibold">My Customers</Link>
        <Link to="/reports/sales" className="bg-white p-4 rounded-xl border text-center font-semibold">Sales Report</Link>
      </div>
    </div>
  );
}
