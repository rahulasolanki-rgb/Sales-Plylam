import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiProxy } from "../apiProxy";
import type { OrderDetail as OrderDetailType } from "../types/api";
import { ArrowLeft, Share2, Download, Package, Truck, Check, Inbox, CheckCircle2 } from "lucide-react";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await (apiProxy.getOrderById?.(id!) ?? apiProxy.getOrder?.(id!));
        setOrder(data as OrderDetailType);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-text-dark">Loading Order...</div>;
  if (!order) return <div className="p-8 text-center text-text-dark">Order not found</div>;

  const orderTotal = Number(order.amount ?? 0);

  const allSteps = ["Created", "Accepted", "Approved", "Invoiced", "Dispatched", "Completed"];
  const currentIndex = allSteps.indexOf(order.status);
  const steps = [
    { label: "Order Created", status: "Created", icon: Check },
    { label: "Accepted", status: "Accepted", icon: Check },
    { label: "Approved", status: "Approved", icon: Check },
    { label: "Invoiced", status: "Invoiced", icon: Package },
    { label: "Dispatched", status: "Dispatched", icon: Truck },
    { label: "Completed", status: "Completed", icon: Inbox },
  ].map((step) => ({ ...step, completed: allSteps.indexOf(step.status) <= currentIndex }));

  const getCurrentStatusInfo = (status: string) => {
    switch (status) {
      case "Completed":
        return { label: "DELIVERED", title: "Order Delivered", icon: CheckCircle2, sub: "Package received by customer" };
      case "Dispatched":
        return { label: "SHIPPED", title: "In Transit", icon: Truck, sub: "Out for delivery" };
      case "Invoiced":
        return { label: "INVOICED", title: "Invoice Generated", icon: Package, sub: "Billing is completed" };
      case "Approved":
        return { label: "APPROVED", title: "Order Approved", icon: Check, sub: "Ready for invoicing" };
      case "Accepted":
        return { label: "ACCEPTED", title: "Order Accepted", icon: Check, sub: "Under review" };
      case "Created":
      default:
        return { label: "PLACED", title: "Order Received", icon: Package, sub: "We are processing your order" };
    }
  };

  const currentStatus = getCurrentStatusInfo(order.status);

  return (
    <div className="bg-white min-h-screen pb-24">
      <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-text-dark">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-text-dark">Order Receipt</h1>
        <button
          className="w-10 h-10 flex items-center justify-center text-text-dark"
          onClick={async () => {
            const jsPDF = (await import("jspdf")).jsPDF;
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text("Order Receipt", 10, 15);
            doc.setFontSize(12);
            doc.text(`Order ID: ${order.id}`, 10, 30);
            doc.text(`Customer Name: ${order.customerName ?? "-"}`, 10, 40);
            doc.text(`Date: ${order.order_date ? new Date(order.order_date).toLocaleDateString() : "-"}`, 10, 50);
            doc.text(`Status: ${order.status}`, 10, 60);
            doc.text("Items:", 10, 70);
            let y = 80;
            (order.items ?? []).forEach((item, idx) => {
              const itemPrice = Number(item.unitPrice ?? 0);
              doc.text(`${item.productName ?? item.product_id} x${item.quantity} @ ₹${itemPrice}`, 15, y + idx * 10);
            });
            doc.text(`Total: ₹${orderTotal.toLocaleString()}`, 10, y + (order.items?.length ?? 0) * 10 + 10);
            doc.save(`Order_${order.id}.pdf`);
          }}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 rounded-xl p-4 flex items-center justify-center">
            <Inbox className="w-10 h-10 text-primary" />
          </div>
          <div className="flex flex-col">
            <p className="text-text-dark text-2xl font-extrabold leading-tight tracking-tight">{order.customerName ?? "Customer"}</p>
            <p className="text-text-dark/60 text-sm font-medium">Order #{order.id}</p>
            <p className="text-text-dark/60 text-sm font-medium">Sales Person: {order.salesPerson ?? "-"}</p>
            <p className="text-text-dark/50 text-sm">Placed on {order.order_date ? new Date(order.order_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}</p>
          </div>
        </div>

        <div className="bg-primary/10 p-6 rounded-xl border border-primary/20 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-text-dark/80 text-sm font-semibold uppercase tracking-wider">Current Status</p>
            <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">{currentStatus.label}</span>
          </div>
          <p className="text-text-dark tracking-tight text-3xl font-extrabold leading-tight">{currentStatus.title}</p>
          <p className="text-text-dark/70 text-sm font-medium flex items-center gap-1">
            <currentStatus.icon className="w-4 h-4" />
            {currentStatus.sub}
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-text-dark text-sm font-bold uppercase tracking-wider">Track Progress</h2>
          <div className="grid grid-cols-[40px_1fr] gap-x-2">
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step.completed ? "bg-primary text-white" : "bg-gray-100 text-text-dark/30"}`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  {i < steps.length - 1 && <div className={`w-[2px] h-8 ${step.completed ? "bg-primary" : "bg-gray-200"}`}></div>}
                </div>
                <div className={`flex flex-col ${i < steps.length - 1 ? "pb-6" : ""}`}>
                  <p className={`text-base font-bold leading-none ${step.completed ? "text-text-dark" : "text-text-dark/40"}`}>{step.label}</p>
                  <p className={`text-xs mt-1 ${step.completed ? "text-text-dark/60" : "text-text-dark/40"}`}>{step.completed ? "Completed" : "Pending"}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-text-dark text-sm font-bold uppercase tracking-wider">Order Materials</h2>
          <div className="space-y-4">
            {(order.items ?? []).map((item, i) => {
              const itemPrice = Number(item.unitPrice ?? 0);
              return (
                <div key={i} className="flex items-center justify-between p-4 bg-background-light rounded-xl border border-gray-200">
                  <div className="flex-1">
                    <p className="text-text-dark font-bold text-sm">{item.productName ?? item.product_id}</p>
                    <p className="text-text-dark/60 text-xs">{item.quantity} Units • ₹{itemPrice}/ea</p>
                  </div>
                  <p className="text-text-dark font-bold">₹{(itemPrice * item.quantity).toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="bg-background-light rounded-2xl p-6 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-dark/60">Subtotal</span>
            <span className="text-text-dark font-medium">₹{orderTotal.toLocaleString()}</span>
          </div>
          <div className="h-px bg-text-dark/10 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-text-dark font-extrabold text-lg">Grand Total</span>
            <span className="text-primary font-extrabold text-2xl">₹{orderTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 flex gap-3 z-10 max-w-md mx-auto">
          <button onClick={() => alert("Invoice download started (Demo)")} className="flex-1 bg-primary text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <Download className="w-5 h-5" />
            Download Invoice
          </button>
          <button className="w-14 h-14 bg-background-light text-text-dark rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
