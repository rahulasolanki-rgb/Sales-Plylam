import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ChevronRight, Search } from "lucide-react";
import { apiProxy } from "../apiProxy";
import type { Invoice } from "../types/api";

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await apiProxy.getInvoices();
        setInvoices(Array.isArray(data) ? data : (data?.data ?? []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Invoices...</div>;

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-4">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest">My Invoices</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search invoices..." className="w-full pl-9 pr-4 py-3 bg-slate-100 border-none rounded-2xl text-xs focus:ring-2 focus:ring-primary/20" />
        </div>
      </header>

      <div className="space-y-4">
        {invoices.map((invoice) => {
          const invoiceDate = invoice.issue_date ?? "";
          const total = Number(invoice.grand_total ?? 0);
          return (
            <Link
              key={invoice.id}
              to={`/invoice/${invoice.id}`}
              className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-primary/20 transition-all"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{invoice.id}</h3>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {invoice.status}
                  </span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  {invoiceDate ? new Date(invoiceDate).toLocaleDateString() : "-"} • Order #{invoice.order_id}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-lg font-black text-slate-900">₹{total.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-primary font-black text-[10px] uppercase tracking-widest">
                    Details
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {invoices.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No invoices yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
