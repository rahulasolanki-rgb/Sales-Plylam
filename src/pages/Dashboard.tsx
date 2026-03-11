import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiProxy } from "../apiProxy";
import { DashboardMetrics } from "../types";

const formatCurrency = (value: number | null | undefined) => {
  const normalized = value ?? 0;
  return `\u20B9${normalized.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

const zeroMetrics: DashboardMetrics = {
  monthly_sales: 0,
  new_orders_week: 0,
  assigned_customers: 0,
  pending_orders_count: 0,
  total_outstanding: 0,
  due_invoices_count: 0,
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await apiProxy.getDashboard();
        setMetrics(data);
      } catch (error) {
        console.error("Unable to load dashboard metrics", error);
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

  const summary = metrics ?? zeroMetrics;
  const statCards = [
    { label: "Monthly Sales", value: formatCurrency(summary.monthly_sales), detail: "This month" },
    { label: "New Orders (week)", value: summary.new_orders_week, detail: "Added in last 7 days" },
    { label: "Assigned Customers", value: summary.assigned_customers, detail: "Under your coverage" },
    { label: "Pending Orders", value: summary.pending_orders_count, detail: "Not Completed/Cancelled" },
    { label: "Outstanding", value: formatCurrency(summary.total_outstanding), detail: "Total receivables" },
    { label: "Due Invoices", value: summary.due_invoices_count, detail: "Status 'Due'" },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-black">Sales Dashboard</h1>

      <div className="grid grid-cols-2 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-4 border flex flex-col justify-between">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{card.label}</p>
            <p className="text-2xl font-black text-slate-900 mt-2">{card.value}</p>
            <p className="text-[10px] text-slate-500 mt-1">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/products" className="bg-primary text-white p-4 rounded-xl font-semibold text-center">Browse Products</Link>
        <Link to="/cart" className="bg-white p-4 rounded-xl border text-center font-semibold">Cart</Link>
      </div>

    </div>
  );
}
