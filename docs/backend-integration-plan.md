# Backend Integration Plan

This document outlines the step-by-step process to securely and reliably integrate a live Firebase backend into the TioraS application, replacing the current mock data setup.

## Phase 1: Stabilize the Environment

- **Objective**: Ensure the development environment is stable and all necessary Firebase configurations are correctly managed.
- **Tasks**:
    1. Verify that all server-side errors are resolved by temporarily reverting to mock data.
    2. Confirm that the `firebase-admin` package is removed to prevent further server crashes.
    3. Ensure the client-side Firebase implementation is correctly initialized and managed via `FirebaseClientProvider`.

## Phase 2: Re-implement Server-Side Authentication

- **Objective**: Create a robust and completely stable server-side Firebase Admin SDK initialization.
- **Tasks**:
    1. Re-add the `firebase-admin` package to `package.json`.
    2. Create a new, simplified `src/firebase/server-config.ts` file that uses a guaranteed singleton pattern. This file will initialize the Admin SDK **once** and export a single `getFirebaseAdmin` function.
    3. Test this initialization by implementing a single, simple server-side action that reads a document to confirm the connection is stable.

## Phase 3: Connect Admin Dashboard to Firestore

- **Objective**: Incrementally connect the admin dashboard features to live Firestore data using the stabilized server-side connection.
- **Tasks**:
    1. **User Count**: Update `getAdminDashboardData` to fetch the total user count from `/users`.
    2. **Order Metrics**: Update `getAdminDashboardData` to fetch and calculate total orders and revenue. This will initially be done by fetching all orders and calculating in-memory to avoid indexing issues.
    3. **Pending Orders**: Update the logic to count pending orders from the fetched data.
    4. **Recent Orders**: Connect the "Recent Orders" table to display the 5 most recent orders.
    5. **All Orders Page**: Connect the `/admin/orders` page to display all orders from Firestore.
    6. **Status Updates**: Re-implement `updateOrderStatus` to modify order documents directly in Firestore.

## Phase 4: Full Backend Migration

- **Objective**: Migrate all remaining mock data and actions to use Firestore.
- **Tasks**:
    1. **Product Management**: Connect `product-actions.ts` to fetch products from the `/products` collection.
    2. **User Dashboard**: Connect the `/dashboard` page to fetch a user's specific orders and saved designs.
    3. **Order Creation**: Update `order-actions.ts` to write new orders to the correct user's sub-collection in Firestore.
    4. **Design Saving**: Update `design-actions.ts` to save user-generated designs to their profile in Firestore.
    5. **Admin Design Review**: Connect the design review page and actions to live data.

By following this phased approach, we can ensure each part of the backend is stable before moving to the next, preventing the recurrence of the errors you've been experiencing.
