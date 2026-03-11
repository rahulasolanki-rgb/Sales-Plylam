import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiProxy } from "../apiProxy";
import { OrderDetails } from "../types";
import { ArrowLeft, Share2, Package, Truck, Check, Inbox, CheckCircle2 } from "lucide-react";
import { getStoredProfile } from "../utils/profile";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await apiProxy.getOrder(id!);
        setOrder(data);
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

  const getStatusSteps = (status: string) => {
    const allSteps = [
      { label: "Order Placed", status: "Created", icon: Check },
      { label: "Approved", status: "Approved", icon: Check },
      { label: "Paid", status: "Paid", icon: Check },
      { label: "Shipped", status: "Dispatched", icon: Truck },
      { label: "Delivered", status: "Completed", icon: Inbox },
    ];

    const statusOrder = ["Created", "Approved", "Paid", "Dispatched", "Completed"];
    const currentIndex = statusOrder.indexOf(status);

    return allSteps.map((step) => ({
      ...step,
      completed: statusOrder.indexOf(step.status) <= currentIndex,
      date: statusOrder.indexOf(step.status) <= currentIndex ? "Completed" : "Pending"
    }));
  };

  const steps = getStatusSteps(order.status);

  const getCurrentStatusInfo = (status: string) => {
    switch (status) {
      case 'Completed':
        return { label: 'DELIVERED', title: 'Order Delivered', icon: CheckCircle2, sub: 'Package received by customer' };
      case 'Dispatched':
        return { label: 'SHIPPED', title: 'In Transit', icon: Truck, sub: '' };
      case 'Paid':
        return { label: 'PAID', title: 'Payment Confirmed', icon: Check, sub: 'Order is being prepared' };
      case 'Approved':
        return { label: 'APPROVED', title: 'Order Approved', icon: Check, sub: 'Awaiting payment' };
      case 'Created':
      default:
        return { label: 'PLACED', title: 'Order Received', icon: Package, sub: 'We are processing your order' };
    }
  };

  const currentStatus = getCurrentStatusInfo(order.status);

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-text-dark">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-text-dark">Order Receipt</h1>
        <button
          className="w-10 h-10 flex items-center justify-center text-text-dark"
          onClick={async () => {
            if (!order) return;
            const jsPDF = (await import('jspdf')).jsPDF;
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text(`Order Receipt`, 10, 15);
            doc.setFontSize(12);
            doc.text(`Order ID: ${order.id}`, 10, 30);
            doc.text(`Date: ${new Date(order.order_date ?? Date.now()).toLocaleDateString()}`, 10, 40);
            doc.text(`Status: ${order.status}`, 10, 50);
            doc.text(`Customer: ${order.customerName ?? "Customer"}`, 10, 60);
            doc.text(`Items:`, 10, 70);
            let y = 80;
            order.items.forEach((item, idx) => {
              doc.text(
                `${item.productName ?? item.product_id} x${item.quantity} @ ₹${item.unitPrice ?? "0"}`,
                15,
                y + idx * 10
              );
            });
            doc.text(`Total: ₹${Number(order.amount ?? 0).toLocaleString()}`, 10, y + order.items.length * 10 + 10);
            doc.save(`Order_${order.id}.pdf`);
          }}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      <div className="p-6 space-y-6">
        {/* Order Info */}
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 rounded-xl p-4 flex items-center justify-center">
            <Inbox className="w-10 h-10 text-primary" />
          </div>
          <div className="flex flex-col">
            <p className="text-text-dark text-2xl font-extrabold leading-tight tracking-tight">
              {order.customerName ?? getStoredProfile()?.name ?? getStoredProfile()?.email ?? "Customer"}
            </p>
            <p className="text-text-dark/60 text-sm font-medium">Order #{order.id}</p>
            <p className="text-text-dark/50 text-sm">Placed on {new Date(order.order_date ?? Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Status Card */}
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

        {/* Track Progress */}
        <section className="space-y-4">
          <h2 className="text-text-dark text-sm font-bold uppercase tracking-wider">Track Progress</h2>
          <div className="grid grid-cols-[40px_1fr] gap-x-2">
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step.completed ? "bg-primary text-white" : "bg-gray-100 text-text-dark/30"
                  } ${step.status === 'Dispatched' && step.completed ? "shadow-[0_0_15px_rgba(86,125,156,0.4)]" : ""}`}>
                    <step.icon className={`w-4 h-4 ${step.completed ? "font-bold" : ""}`} />
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-[2px] h-8 ${step.completed ? "bg-primary" : "bg-gray-200"}`}></div>
                  )}
                </div>
                <div className={`flex flex-col ${i < steps.length - 1 ? "pb-6" : ""}`}>
                  <p className={`text-base font-bold leading-none ${
                    step.completed ? (step.status === 'Dispatched' ? "text-primary" : "text-text-dark") : "text-text-dark/40"
                  }`}>
                    {step.label}
                  </p>
                  <p className={`text-xs mt-1 ${step.completed ? "text-text-dark/60" : "text-text-dark/40"}`}>
                    {step.date === "Completed" ? "Oct 24, 09:15 AM" : step.date}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Order Materials */}
        <section className="space-y-4">
          <h2 className="text-text-dark text-sm font-bold uppercase tracking-wider">Order Materials</h2>
          <div className="space-y-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-background-light rounded-xl border border-gray-200">
                <div className="flex-1">
                  <p className="text-text-dark font-bold text-sm">{item.productName ?? item.product_id}</p>
                  <p className="text-text-dark/60 text-xs">{item.quantity} Units • ₹{item.unitPrice ?? "0"}/ea</p>
                </div>
                <p className="text-text-dark font-bold">₹{(Number(item.unitPrice ?? 0) * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 rounded-xl border border-gray-200">
            <p className="text-text-dark/50 text-[10px] font-bold uppercase tracking-widest mb-2">Customer</p>
            <p className="text-text-dark text-xs leading-relaxed font-medium">
              {order.customerName ?? "Customer"}<br/>
              Address not available
            </p>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-background-light rounded-2xl p-6 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-dark/60">Subtotal</span>
            <span className="text-text-dark font-medium">₹{Number(order.amount ?? 0).toLocaleString()}</span>
          </div>
          <div className="h-px bg-text-dark/10 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-text-dark font-extrabold text-lg">Grand Total</span>
            <span className="text-primary font-extrabold text-2xl">₹{Number(order.amount ?? 0).toLocaleString()}</span>
          </div>
        </div>

      </div>
    </div>
  );
}



