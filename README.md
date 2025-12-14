# TioraS - AI-Powered Menswear E-Commerce Platform

This project is a modern e-commerce application built with Next.js, React, and ShadCN UI, featuring a unique AI-powered Design Studio for creating custom apparel.

## Key Features

- **AI Design Studio**: Users can generate unique apparel designs from text prompts using Genkit, preview them on different products, and save their creations.
- **Full E-commerce Experience**: The application provides a complete shopping flow, from a product catalog and detailed product pages to a persistent shopping cart and a secure checkout process.
- **Admin Dashboard**: A dedicated section for administrators to manage the store, including viewing sales metrics, managing orders, and reviewing user-submitted AI designs.
- **Responsive & Modern UI**: Built with ShadCN UI and Tailwind CSS, the interface is designed to be fully responsive and visually appealing on all devices.

## Current Status

The core frontend and AI-powered features have been implemented. The application currently uses mock data for products, orders, and user information, simulating a backend with Server Actions and in-memory data stores.

## Next Steps & Future Improvements

The immediate priority is to replace the mock backend with a robust, scalable solution. Here is a suggested roadmap:

### 1. Backend Integration (High Priority)
- **Implement User Authentication**: Integrate Firebase Authentication to allow users to sign up, log in, and manage their accounts.
- **Connect to Firestore**: Migrate all data (products, orders, saved designs, user profiles) to a persistent Firebase Firestore database.
- **Secure Admin Panel**: Use Firebase Custom Claims to implement role-based access control, ensuring only authorized administrators can access the `/admin` section.

### 2. Enhance User-Facing Features
- **Functional User Dashboard**: Connect the `/dashboard` page to Firestore to display real order history and a user's saved design gallery.
- **Advanced AI Design Tools**:
  - **Inpainting/Outpainting**: Allow users to edit or extend specific parts of an AI-generated image.
  - **Style Variations**: Enable users to generate a design and then create variations in different artistic styles (e.g., "Vintage," "Minimalist").

### 3. Improve Admin Capabilities
- **Advanced Analytics**: Add more detailed charts and data visualizations to the admin dashboard for deeper sales insights.
- **Search & Filtering**: Implement robust search and filtering functionality for the orders and design review pages.
