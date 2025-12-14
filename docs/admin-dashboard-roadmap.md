# Admin Dashboard Improvement Roadmap

This document outlines the planned features and enhancements for the TioraS Admin Dashboard to provide comprehensive control over the e-commerce platform.

## 1. Dynamic Dashboard Metrics (High Priority)
- **Objective**: Replace mocked dashboard statistics with real-time data from Firestore.
- **Tasks**:
    - Connect the "Total Revenue" card to aggregate the `total` field from all `orders`.
    - Connect the "Total Orders" card to count all documents in the `orders` collections.
    - Connect the "Active Users" card to count registered users.
    - Add a chart to visualize sales revenue over the past 7 days.

## 2. Full Product Management (CRUD)
- **Objective**: Allow admins to create, read, update, and delete products directly from the UI.
- **Tasks**:
    - Create a new "Products" page in the admin section.
    - Display a table of all existing products with options to edit or delete.
    - Build a form for creating new products, including fields for name, price, description, sizes, colors, and image uploads.
    - Build a corresponding form for editing existing products.

## 3. Detailed Order Views
- **Objective**: Enable admins to view the full details of any specific order.
- **Tasks**:
    - Make each row in the "All Orders" table clickable.
    - Create a dedicated page template for viewing a single order.
    - Display all order information: order number, status, total, customer shipping info, and a list of all items in the order (product, quantity, size, color).

## 4. User Management
- **Objective**: Provide a way for admins to see and manage registered users.
- **Tasks**:
    - Create a new "Users" page in the admin section.
    - Display a list of all users from the `/users` collection in Firestore.
    - Show key information like name, email, and sign-up date.
    - (Future) Add functionality to view a user's order history or assign roles.

## 5. Enhanced Design Reviews
- **Objective**: Improve the existing design review workflow.
- **Tasks**:
    - Add filtering options to the "Design Reviews" page (e.g., filter by status: Draft, Approved, Rejected).
    - Potentially add a search bar to find designs by name or user.
