import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { apiProxy } from "../apiProxy";
import PaginationControls from "../components/PaginationControls";
import { Customer } from "../types";

const PER_PAGE = 8;

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const params = {
          scope: "mine",
          status: "approved",
          search: debouncedSearch || undefined,
          page: currentPage,
          per_page: PER_PAGE,
        };
        const res: any = await apiProxy.getCustomers(params);
        if (!active) return;
        const data: Customer[] = Array.isArray(res) ? res : res?.data ?? [];
        setCustomers(data);
        const pagination = res?.pagination;
        const computedTotal = pagination?.total ?? data.length;
        const computedPages = pagination?.total_pages ?? Math.max(1, Math.ceil(computedTotal / PER_PAGE));
        setTotalPages(computedPages);
      } catch (err) {
        console.error(err);
        if (active) setError("Unable to load customers");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [currentPage, debouncedSearch]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-4">
      <h1 className="text-2xl font-black">My Customers</h1>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search approved customers..."
          className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-2xl text-xs focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {error && <p className="text-xs text-rose-600">{error}</p>}

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: PER_PAGE }).map((_, index) => (
            <div key={index} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          ))
        ) : customers.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <p className="text-slate-400 uppercase tracking-[0.2em] text-xs font-black">No approved customers found</p>
          </div>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-900">{customer.name}</p>
                  {customer.contactPerson && (
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">{customer.contactPerson}</p>
                  )}
                </div>
                <span className="text-[10px] uppercase tracking-widest font-black text-emerald-500">Approved</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{customer.phone} • {customer.email}</p>
              <p className="text-sm mt-2 text-slate-600">Outstanding: ₹{Number(customer.outstandingBalance ?? 0).toLocaleString()}</p>
            </div>
          ))
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
