import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiProxy } from "../apiProxy";
import { Order } from "../types";
import { ClipboardList, ChevronRight, Search } from "lucide-react";
import PaginationControls from "../components/PaginationControls";

const ORDERS_PER_PAGE = 8;

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    (async () => {
      try {
        const params: Record<string, string | number | undefined> = {
          scope: "mine",
          page: currentPage,
          per_page: ORDERS_PER_PAGE,
          search: debouncedSearch || undefined,
          status: statusFilter !== "All" ? statusFilter : undefined,
        };
        const res: any = await apiProxy.getOrders(params);
        if (!active) return;
        const data: Order[] = Array.isArray(res) ? res : (res?.data ?? []);
        setOrders(data);
        const pagination = res?.pagination;
        const computedTotal = pagination?.total ?? data.length;
        const computedPages = pagination?.total_pages ?? Math.max(1, Math.ceil(computedTotal / ORDERS_PER_PAGE));
        setTotalPages(computedPages);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [currentPage, debouncedSearch, statusFilter]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Orders...</div>;

  const statuses = ["All", "Created", "Approved", "Paid", "Dispatched", "Completed"];
  const displayedOrders = orders.filter((order) => statusFilter === "All" || order.status === statusFilter);

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <header className="space-y-4">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest">My Orders</h1>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs focus:ring-2 focus:ring-primary/20 shadow-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  statusFilter === status
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white text-slate-400 border border-slate-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="space-y-4">
        {displayedOrders.map((order) => (
          <Link
            key={order.id}
            to={`/order/${order.id}`}
            className="block bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-primary/20 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">Order #{order.id}</p>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">{order.customerName ?? "Customer"}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                {new Date(order.order_date ?? Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                order.status === 'Created' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {order.status}
              </span>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Amount</p>
                <p className="text-xl font-black text-slate-900">₹{Number(order.amount ?? 0).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1 text-primary font-black text-[10px] uppercase tracking-widest">
                View Details
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}

        {displayedOrders.length === 0 && (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <ClipboardList className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No orders found</p>
              <Link to="/products" className="text-primary font-black text-xs uppercase tracking-widest inline-block">Browse Products</Link>
            </div>
          )}
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        disabled={loading}
      />
    </div>
  );
}
