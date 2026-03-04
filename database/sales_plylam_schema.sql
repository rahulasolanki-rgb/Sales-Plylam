CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `description`, `timestamp`) VALUES
(1, 1, 'User Login', 'Admin User logged in from IP 127.0.0.1', '2026-02-19 06:28:10'),
(2, 3, 'Order Creation', 'Sales Person User created order ORD-26004', '2026-02-19 06:28:10');

-- --------------------------------------------------------

--
-- Table structure for table `api_tokens`
--

CREATE TABLE `api_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `api_tokens`
--

INSERT INTO `api_tokens` (`id`, `user_id`, `token`, `created_at`, `expires_at`) VALUES
(1, 3, 'b8be1146ef3e7ae506ee16df8a39212361b20665236ba55dcccb91672d6f63d6', '2026-03-04 07:50:48', '2026-03-04 08:50:48');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Plywood'),
(2, 'Timber'),
(3, 'Veneer');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `legalName` varchar(255) DEFAULT NULL,
  `gstin` varchar(15) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `contactPerson` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `type` enum('Dealer','Retailer') NOT NULL,
  `creditLimit` decimal(12,2) DEFAULT 0.00,
  `outstandingBalance` decimal(12,2) DEFAULT 0.00,
  `status` enum('Approved','Pending Approval') NOT NULL DEFAULT 'Pending Approval',
  `sales_person_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `legalName`, `gstin`, `address`, `contactPerson`, `phone`, `email`, `type`, `creditLimit`, `outstandingBalance`, `status`, `sales_person_id`, `created_at`) VALUES
(1, 'BuildRight Constructions', 'BuildRight Constructions Pvt Ltd', '29AABCU9567M1Z5', '123 MG Road, Bangalore', 'Priya Singh', '9988776655', 'priya.s@buildright.com', 'Dealer', 500000.00, 125000.00, 'Approved', 3, '2026-02-19 06:28:10'),
(2, 'Elegant Interiors', 'Elegant Interiors LLP', '32BBBFG4589K1Z3', '456 Residency Road, Bangalore', 'Mike Ross', '9988776644', 'mike.r@elegant.com', 'Retailer', 100000.00, 0.00, 'Approved', 3, '2026-02-19 06:28:10'),
(3, 'New Age Developers', 'New Age Developers Inc', '27CCCHJ7894L1Z2', '789 Koramangala, Bangalore', 'Sarah Jenkins', '9988776633', 'sarah.j@newage.com', 'Dealer', 200000.00, 35000.00, 'Pending Approval', 3, '2026-02-19 06:28:10');

-- --------------------------------------------------------

--
-- Table structure for table `customer_notes`
--

CREATE TABLE `customer_notes` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_notes`
--

INSERT INTO `customer_notes` (`id`, `customer_id`, `user_id`, `note`, `created_at`) VALUES
(1, 1, 3, 'Followed up on quote for new project. Seems positive.', '2026-02-19 06:28:10'),
(2, 2, 3, 'Customer requested samples of new veneer stock.', '2026-02-19 06:28:10');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_logs`
--

CREATE TABLE `inventory_logs` (
  `id` int(11) NOT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `adjusted_by` int(11) DEFAULT NULL,
  `change` int(11) DEFAULT NULL,
  `new_stock` int(11) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_logs`
--

INSERT INTO `inventory_logs` (`id`, `product_id`, `adjusted_by`, `change`, `new_stock`, `reason`, `timestamp`) VALUES
(1, 'PLY-002', 1, -2, 8, 'Stock correction after audit.', '2026-02-19 06:28:10');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` varchar(50) NOT NULL,
  `order_id` varchar(50) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `sub_total` decimal(12,2) DEFAULT NULL,
  `cgst` decimal(12,2) DEFAULT NULL,
  `sgst` decimal(12,2) DEFAULT NULL,
  `grand_total` decimal(12,2) DEFAULT NULL,
  `status` enum('Paid','Due','Overdue') NOT NULL DEFAULT 'Due'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `order_id`, `customer_id`, `issue_date`, `due_date`, `sub_total`, `cgst`, `sgst`, `grand_total`, `status`) VALUES
('INV-26001', 'ORD-26001', 1, '2026-07-28', '2026-08-12', 55000.00, 4950.00, 4950.00, 64900.00, 'Paid'),
('INV-26002', 'ORD-26002', 2, '2026-07-30', '2026-08-14', 16000.00, 1440.00, 1440.00, 18880.00, 'Due');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int(11) NOT NULL,
  `invoice_id` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` varchar(50) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `customerName` varchar(255) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `amount` decimal(12,2) DEFAULT NULL,
  `status` enum('Created','Accepted','Approved','Invoiced','Dispatched','Completed','Cancelled') NOT NULL DEFAULT 'Created',
  `paymentStatus` enum('Credit','Paid') NOT NULL DEFAULT 'Credit',
  `sales_person_id` int(11) DEFAULT NULL,
  `salesPerson` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `customerName`, `order_date`, `amount`, `status`, `paymentStatus`, `sales_person_id`, `salesPerson`) VALUES
('ORD-1771663578', 1, 'BuildRight Constructions', '2026-02-21 08:46:18', 234.00, 'Created', 'Credit', 1, 'Admin User'),
('ORD-26001', 1, 'BuildRight Constructions', '2026-07-28 04:30:00', 55000.00, 'Completed', 'Paid', 3, 'Sales Person User'),
('ORD-26002', 2, 'Elegant Interiors', '2026-07-29 09:00:00', 16000.00, 'Dispatched', 'Credit', 3, 'Sales Person User'),
('ORD-26003', 1, 'BuildRight Constructions', '2026-08-01 05:30:00', 119000.00, 'Approved', 'Credit', 3, 'Sales Person User'),
('ORD-26004', 2, 'Elegant Interiors', '2026-08-02 03:45:00', 38000.00, 'Accepted', 'Credit', 3, 'Sales Person User'),
('ORD-26005', 1, 'BuildRight Constructions', '2026-05-15 04:30:00', 74500.00, 'Completed', 'Paid', 3, 'Sales Person User'),
('ORD-26006', 2, 'Elegant Interiors', '2026-06-20 09:00:00', 32000.00, 'Completed', 'Paid', 3, 'Sales Person User');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` varchar(50) DEFAULT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `productName` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `unitPrice` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `productName`, `quantity`, `unitPrice`) VALUES
(1, 'ORD-26001', 'PLY-001', '18mm Gurjan Plywood (8x4)', 25, 2200.00),
(2, 'ORD-26002', 'VEN-001', 'Natural Oak Veneer', 200, 80.00),
(3, 'ORD-26003', 'PLY-001', '18mm Gurjan Plywood (8x4)', 50, 2200.00),
(4, 'ORD-26003', 'TIM-001', 'Teak Wood (CFT)', 2, 4500.00),
(5, 'ORD-26004', 'PLY-002', '12mm Commercial Plywood', 20, 1400.00),
(6, 'ORD-26004', 'VEN-001', 'Natural Oak Veneer', 125, 80.00),
(7, 'ORD-26005', 'TIM-001', 'Teak Wood (CFT)', 15, 4500.00),
(8, 'ORD-26005', 'PLY-002', '12mm Commercial Plywood', 5, 1400.00),
(9, 'ORD-26006', 'VEN-001', 'Natural Oak Veneer', 400, 80.00),
(10, 'ORD-1771663578', 'PLY-001', '18mm Gurjan Plywood (8x4)', 1, 234.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `stock` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `priceUnit` varchar(20) DEFAULT NULL,
  `gstRate` int(11) DEFAULT NULL,
  `reorderLevel` int(11) DEFAULT 10,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category_id`, `stock`, `price`, `status`, `priceUnit`, `gstRate`, `reorderLevel`, `created_at`) VALUES
('PLY-001', '18mm Gurjan Plywood (8x4)', 1, 150, 2200.00, 'Active', 'per piece', 18, 20, '2026-02-19 06:28:10'),
('PLY-002', '12mm Commercial Plywood', 1, 8, 1400.00, 'Active', 'per piece', 18, 10, '2026-02-19 06:28:10'),
('PLY-614', 'Rahul Solanki', 1, 10, 234.00, 'Active', 'per sqft', 5, 10, '2026-02-19 08:26:41'),
('TIM-001', 'Teak Wood (CFT)', 2, 50, 4500.00, 'Active', 'per cft', 18, 5, '2026-02-19 06:28:10'),
('VEN-001', 'Natural Oak Veneer', 3, 300, 80.00, 'Active', 'per sqft', 12, 50, '2026-02-19 06:28:10');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `company_name` varchar(255) DEFAULT NULL,
  `gstin` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `tally_ip` varchar(50) DEFAULT NULL,
  `tally_port` varchar(10) DEFAULT NULL,
  `tally_company` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `company_name`, `gstin`, `phone`, `address`, `logo_url`, `tally_ip`, `tally_port`, `tally_company`) VALUES
(1, 'Natural Plylam', '29AAAAA0000A1Z5', '9988776655', '123 Industrial Area, Bangalore, 560001', NULL, '192.168.1.100', '9000', 'Natural Plylam (23-24)');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('Super Admin','Admin / Owner','Manager','Sales Person','Customer','Sub-user') NOT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `customer_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `role`, `status`, `customer_id`, `created_at`) VALUES
(1, 'Admin User', 'admin@timberinc.com', '$2y$10$7a8pybVseRgfQb.zmA8g2usObwJhj2zpDwkA3/6fm6R36NyN/2Nd6', '9876543210', 'Super Admin', 'Active', NULL, '2026-02-19 06:28:10'),
(2, 'Manager User', 'manager@timberinc.com', '$2y$10$9G2p1H1gL6mJ5Z9eZ4X.L.jF3n8bN6P/a3yY0z8x7t.R4P0lO3wIe', '9876543211', 'Manager', 'Active', NULL, '2026-02-19 06:28:10'),
(3, 'Sales Person User', 'sales@timberinc.com', '$2y$10$x5qLVSPd0L8kq/XT1fZV0.xveLgJhdzjXyzs9Bsh3ikKrrpT3bqrS', '9876543212', 'Sales Person', 'Active', NULL, '2026-02-19 06:28:10'),
(4, 'Priya Singh (BuildRight)', 'priya.s@buildright.com', '$2y$10$9G2p1H1gL6mJ5Z9eZ4X.L.jF3n8bN6P/a3yY0z8x7t.R4P0lO3wIe', '9988776655', 'Customer', 'Active', 1, '2026-02-19 06:28:10'),
(5, 'Mike Ross (Elegant)', 'mike.r@elegant.com', '$2y$10$9G2p1H1gL6mJ5Z9eZ4X.L.jF3n8bN6P/a3yY0z8x7t.R4P0lO3wIe', '9988776644', 'Customer', 'Active', 2, '2026-02-19 06:28:10'),
(6, 'Rahul', 'rahulasolanki@yyyy.com', '$2y$10$GSfdf8Mhw9Tq1BqArox8uOAWoKLMts6LwBRTZTMNMlmkJioZQ9JKy', '9080808009', 'Sales Person', 'Active', NULL, '2026-02-19 10:23:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `api_tokens`
--
ALTER TABLE `api_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `gstin` (`gstin`),
  ADD KEY `sales_person_id` (`sales_person_id`);

--
-- Indexes for table `customer_notes`
--
ALTER TABLE `customer_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `inventory_logs`
--
ALTER TABLE `inventory_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `adjusted_by` (`adjusted_by`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `sales_person_id` (`sales_person_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `api_tokens`
--
ALTER TABLE `api_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customer_notes`
--
ALTER TABLE `customer_notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `inventory_logs`
--
ALTER TABLE `inventory_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `api_tokens`
--
ALTER TABLE `api_tokens`
  ADD CONSTRAINT `api_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`sales_person_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `customer_notes`
--
ALTER TABLE `customer_notes`
  ADD CONSTRAINT `customer_notes_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `customer_notes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `inventory_logs`
--
ALTER TABLE `inventory_logs`
  ADD CONSTRAINT `inventory_logs_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `inventory_logs_ibfk_2` FOREIGN KEY (`adjusted_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`sales_person_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
