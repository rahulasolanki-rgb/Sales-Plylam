import type {
  Cart,
  Customer,
  CustomerDetail,
  Invoice,
  Order,
  OrderDetail,
  Product,
} from "../types/api";

export const mockProducts: Product[] = [
  {
    id: "PLY-001",
    name: "Marine Plywood",
    category_id: 1,
    category: "Plywood",
    price: "1500.00",
    priceUnit: "sheet",
    stock: 120,
    status: "Active",
  },
  {
    id: "TIM-001",
    name: "Teak Timber",
    category_id: 2,
    category: "Timber",
    price: "2200.00",
    priceUnit: "cft",
    stock: 80,
    status: "Active",
  },
];

export const mockCustomers: Customer[] = [
  {
    id: 5,
    name: "Acme Pvt Ltd",
    legalName: "Acme Private Limited",
    contactPerson: "John Doe",
    phone: "+91-9000000000",
    email: "accounts@acme.com",
    type: "Dealer",
    creditLimit: "500000.00",
    outstandingBalance: "10000.00",
    status: "Approved",
  },
];

export const mockCustomerDetail: CustomerDetail = {
  ...mockCustomers[0],
  notes: [
    {
      id: 10,
      customer_id: 5,
      user_id: 21,
      note: "Follow-up on payment due",
      created_at: "2025-01-05 09:00:00",
    },
  ],
};

export const mockOrders: Order[] = [
  {
    id: "ORD-20250101-0002",
    customer_id: 5,
    customerName: "Acme Pvt Ltd",
    status: "Created",
    paymentStatus: "Credit",
    order_date: "2025-01-01 10:00:00",
    amount: "32500.00",
    sales_person_id: 21,
    salesPerson: "Sales User",
  },
];

export const mockOrderDetail: OrderDetail = {
  ...mockOrders[0],
  items: [
    {
      order_id: "ORD-20250101-0002",
      product_id: "PLY-001",
      productName: "Marine Plywood",
      quantity: 10,
      unitPrice: "1500.00",
    },
  ],
};

export const mockInvoices: Invoice[] = [
  {
    id: "INV-0001",
    order_id: "ORD-20250101-0002",
    customer_id: 5,
    issue_date: "2025-01-02",
    due_date: "2025-01-30",
    sub_total: "30000.00",
    cgst: "1250.00",
    sgst: "1250.00",
    grand_total: "32500.00",
    status: "Due",
    customerName: "Acme Pvt Ltd",
  },
];

export const mockCart: Cart = {
  items: [
    {
      product_id: "PLY-001",
      name: "Marine Plywood",
      price: "1500.00",
      quantity: 10,
      line_total: "15000.00",
    },
  ],
  total: 15000,
};
