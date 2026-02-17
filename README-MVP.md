# Green Africa Farm - MVP Functionality

This document summarizes the current features and functionality of the Green Africa Farm website (V1.0 MVP).

## 🌍 Frontend Features

### 1. Homepage

- **Dynamic Hero Slider**: Showcases featured products with smooth cinematic transitions and high-resolution visuals.
- **Visual Category Navigation**: Intuitive grid for browsing food categories (Vegetables, Fruits, Grains, Livestock).
- **Premium Aesthetics**: Modern dark-mode inspired footer with emerald accents and developer credits.
- **Responsive Navigation**: Sticky navbar with mobile-optimized menu.

### 2. Admin Dashboard

- **Product Management (CRUD)**:
  - Add, Edit, and Delete farm products.
  - Multi-language support (English, Amharic, Oromo) for descriptions.
  - Image upload with base64 storage.
- **Inventory Pagination**: Optimized list view with 8 items per page and smooth navigation controls.
- **Team Management**:
  - Dedicated section for Managing the Leadership profile.
  - **Constraint**: Strict limit of one leader profile to maintain focus.
- **Mobile-First Design**: App-like interface on mobile with sticky headers and scrollable tab navigation.

### 3. Site-wide Components

- **Global Footer**: Integrated developer credit for "awash-dev" and contact info.
- **Search System**: Real-time inventory search within the admin panel.
- **Notification System**: Success/Error alerts with auto-dismissal for all admin actions.

## ⚙️ Backend Infrastructure

- **RESTful API**: Built with Node.js and Express.
- **Database**: MongoDB integration for persistent storage of products and team members.
- **Security**: Robust validation using `express-validator`.
- **Environment Support**: Dynamic URL switching for local development vs. production.

## 🚀 Build & Deployment Ready

- **Frontend**: Vite-powered building with optimized asset minification.
- **Backend**: TypeScript compilation support for production-ready JavaScript execution.
