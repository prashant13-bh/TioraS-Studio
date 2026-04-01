# TioraS Studio: Vision & Product Features

## 🌟 The Vision

**TioraS Studio** is a next-generation, AI-driven, multi-tenant e-commerce ecosystem. Our mission is to bridge the gap between creative imagination and physical custom apparel by leveraging **Google Imagen 4.0** and a distributed network of high-quality **Vetted Vendors**.

We empower creators to design unique art using AI and provide specialized manufacturing partners (Sellers) with the tools they need to produce and fulfill these designs at scale.

---

## 👥 User Roles & Journeys

### 1. The Creator (Customer)

- **AI Design Studio**: Generate high-fidelity apparel graphics using natural language prompts (Google Imagen).
- **3D Interactive Preview**: Real-time visualization of designs on T-Shirts, Hoodies, and more using a Three.js-powered 3D canvas.
- **Smart Checkout**: Secure payment and order tracking with high-level transparency into the production status.

### 2. The Partner (Seller / Vendor)

- **Vendor Portal**: A dedicated workspace (`/seller`) for order processing and inventory.
- **Product Management**: Full control over their unique catalog, stock levels, and pricing.
- **Kanban Production Board**: A state-of-the-art drag-and-drop board for real-time order status updates (Pre-Press -> Printing -> Packing -> Shipped).
- **Performance Metrics**: Tracking sales, order volume, and customer satisfaction ratings.

### 3. The Controller (Admin)

- **Vetting & Onboarding**: Reviewing and activating new vendor applications to ensure quality standards.
- **Design Review**: Moderating AI-generated content to maintain platform integrity.
- **Intelligent Fulfillment Assignment**: Reviewing incoming customer orders and assigning them to the most capable vendor (e.g., based on printing capability: DTF, Embroidery, etc.).
- **Global Analytics**: Accessing real-time platform revenue, active user counts, and low-stock alerts.

---

## 🛠️ Core Application Features

### 🔐 Security & Data Isolation (Multi-Tenancy)

- **Role-Based Access Control (RBAC)**: Custom Firebase claims and collection-level rules ensure users only see what they are authorized to see.
- **Hardened Data Isolation**: Vendors are strictly isolated via `vendorId` filtering. A vendor can NEVER access another vendor's products or orders, even via APIs (Server Action enforcement).
- **Path-Based Storage**: Media assets are organized by UID, preventing cross-user unauthorized access.

### 📦 Fulfillment Engine

- **Vendor Assignment Logic**: Admins act as the central routing hub, assigning orders to sellers. Once assigned, the order appears only on that specific seller's Kanban board.
- **Real-Time Status Sync**: Updates made by the seller on the Kanban board (e.g., moving an order to "Printing") reflect instantly on the customer-facing dashboard.
- **Invoice Generation**: Automated PDF invoicing for all transactions.

### 🤖 Generative AI Integration

- **Genkit Flows**: Robust server-side AI pipelines for image generation, optimized for high performance and low latency.

---

## 🗺️ Future Roadmap (The "Big Vision")

1.  **SYOG (Send Your Own Garment)**: A revolutionary feature allowing customers to ship their own clothes to vendors for custom printing/upcycling.
2.  **Automated Vendor Payouts**: Integrated financial system for seamless revenue splitting and payouts.
3.  **3D AR Try-On**: Mobile-first Augmented Reality to "test" designs on the body before purchasing.
4.  **Bulk Production for Schools/Teams**: Advanced inventory and bulk-pricing tools for institutional orders.

---

## 📊 Data Model (For Schema Generation)

The application relies on the following interconnected entities:

- **`UserProfile`**: Core identity with `isAdmin` flag.
- **`VendorProfile`**: Extends identity with `storeName`, `status`, and `capabilities`.
- **`Product`**: Owned by a `vendorId`, categorized for the design studio.
- **`Order`**: Tracks `userId` (buyer) and `vendorId` (fulfilled by).
- **`OrderItem`**: Snapshots of the product at the time of purchase.
- **`Design`**: User-owned AI generations.
