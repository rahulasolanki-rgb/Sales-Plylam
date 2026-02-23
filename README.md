# Sales Person Portal (from Customer Portal)

This repository now contains a **sales-person-first portal foundation** with:

- Module structure for dashboard, customers, orders, invoices, cart, profile and reports.
- API integration layer for the Timber & Plywood backend.
- `mock` vs `real API` toggle to support local UI development without backend dependency.

## Features mapped for Sales Person

- Dashboard (summary cards, quick stats)
- My Orders (`scope=mine`) + all visible assigned-customer orders
- My Customers + customer-level notes
- Invoices (all assigned / by customer)
- Cart and create order flows
- Profile and password update
- Sales report primitives from orders + invoices data

## Mock/Real API toggle

Set environment value:

- `USE_MOCK_API=true` → use local mock service responses.
- `USE_MOCK_API=false` → use backend endpoints from `API_BASE_URL`.

See: `src/config/env.ts`.

## Core API usage covered

All important endpoints from the provided docs are mapped in `src/services/api.ts`, including:

- Auth: login/logout/refresh/me/forgot/reset
- Sales endpoints: customers, customer detail, add note, orders (with scope), order detail, invoices, products
- Shared flows: cart, create order, checkout, profile update/change password, health check

## Suggested UI route map

- `/dashboard`
- `/orders`
- `/orders/new`
- `/cart`
- `/customers`
- `/customers/:id`
- `/invoices`
- `/reports/sales`
- `/profile`

## Notes

This is a backend-integration-ready code foundation and is intentionally framework-agnostic.
You can connect it to React/Vue/Angular screens directly using the exported `portalApi` methods.
