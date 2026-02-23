import React, { useEffect, useState } from "react";
import { apiProxy } from "../apiProxy";

type Customer = { id: number; name: string; contactPerson?: string; phone?: string; email?: string; outstandingBalance?: string };

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    apiProxy.getCustomers()
      .then((res: any) => setCustomers(Array.isArray(res) ? res : res?.data ?? []))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-4">
      <h1 className="text-2xl font-black">My Customers</h1>
      {customers.map((customer) => (
        <div key={customer.id} className="bg-white border rounded-2xl p-4">
          <p className="font-bold">{customer.name}</p>
          <p className="text-xs text-slate-500">{customer.contactPerson}</p>
          <p className="text-xs text-slate-500">{customer.phone} • {customer.email}</p>
          <p className="text-sm mt-2">Outstanding: ₹{customer.outstandingBalance ?? "0.00"}</p>
        </div>
      ))}
      {customers.length === 0 && <p className="text-slate-500">No assigned customers.</p>}
    </div>
  );
}
