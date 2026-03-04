import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiProxy } from "../apiProxy";
import type { Invoice, OrderDetail } from "../types/api";
import { ArrowLeft, Share2, CheckCircle2, Clock } from "lucide-react";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoiceListResponse = await apiProxy.getInvoices?.();
        const invoices = Array.isArray(invoiceListResponse) ? invoiceListResponse : (invoiceListResponse?.data ?? []);
        const inv = invoices.find((x: Invoice) => x.id === id);
        if (!inv) {
          setInvoice(null);
          return;
        }
        setInvoice(inv);

        const orderResponse = await (apiProxy.getOrderById?.(inv.order_id) ?? apiProxy.getOrder?.(inv.order_id));
        setOrder(orderResponse as OrderDetail);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Invoice...</div>;
  if (!invoice || !order) return <div className="p-8 text-center text-slate-500">Invoice not found</div>;

  const billTo = order.customerName ?? invoice.customerName ?? `Customer #${invoice.customer_id ?? ""}`;
  const orderAmount = Number(order.amount ?? 0);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <header className="bg-white p-6 flex justify-between items-center sticky top-0 z-10 border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>
        <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest">Invoice Details</h1>
        <button
          className="w-10 h-10 flex items-center justify-center text-slate-900"
          onClick={async () => {
            const jsPDF = (await import("jspdf")).jsPDF;
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text("Invoice Receipt", 10, 15);
            doc.setFontSize(12);
            doc.text(`Invoice ID: ${invoice.id}`, 10, 30);
            doc.text(`Date: ${invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : "-"}`, 10, 40);
            doc.text(`Status: ${invoice.status}`, 10, 50);
            doc.text(`Bill To: ${billTo}`, 10, 60);
            doc.text("Items:", 10, 80);
            let y = 90;
            (order.items ?? []).forEach((item, idx) => {
              const itemPrice = Number(item.unitPrice ?? 0);
              doc.text(`${item.productName ?? item.product_id} x${item.quantity} @ ₹${itemPrice}`, 15, y + idx * 10);
            });
            doc.text(`Total: ₹${Number(invoice.grand_total ?? orderAmount).toLocaleString()}`, 10, y + (order.items?.length ?? 0) * 10 + 10);
            doc.save(`Invoice_${invoice.id}.pdf`);
          }}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      <div className="p-6 space-y-6">
        <div className={`p-6 rounded-[32px] border flex items-center justify-between ${invoice.status === "Paid" ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"}`}>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Status</p>
            <p className={`text-2xl font-black ${invoice.status === "Paid" ? "text-emerald-600" : "text-amber-600"}`}>{invoice.status.toUpperCase()}</p>
          </div>
          {invoice.status === "Paid" ? <CheckCircle2 className="w-10 h-10 text-emerald-500" /> : <Clock className="w-10 h-10 text-amber-500" />}
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice Number</p>
              <p className="text-lg font-black text-slate-900">{invoice.id}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Issued</p>
              <p className="text-sm font-bold text-slate-900">{invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : "-"}</p>
            </div>
          </div>

          <div className="h-px bg-slate-50"></div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bill To</p>
            <p className="text-sm font-black text-slate-900">{billTo}</p>
          </div>

          <div className="h-px bg-slate-50"></div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</p>
            <div className="space-y-3">
              {(order.items ?? []).map((item, i) => {
                const itemPrice = Number(item.unitPrice ?? 0);
                return (
                  <div key={i} className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-slate-900">{item.productName ?? item.product_id}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{item.quantity} x ₹{itemPrice}</p>
                    </div>
                    <p className="text-sm font-black text-slate-900">₹{(itemPrice * item.quantity).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</span>
              <span className="text-sm font-black text-slate-900">₹{Number(invoice.sub_total ?? orderAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CGST + SGST</span>
              <span className="text-sm font-black text-slate-900">₹{(Number(invoice.cgst ?? 0) + Number(invoice.sgst ?? 0)).toLocaleString()}</span>
            </div>
            <div className="pt-4 flex justify-between items-center">
              <span className="text-sm font-black text-slate-900 uppercase tracking-[0.15em]">Total Amount</span>
              <span className="text-3xl font-black text-slate-900">₹{Number(invoice.grand_total ?? orderAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
