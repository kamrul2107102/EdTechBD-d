# LMS MERN WEBSITE

🔗 **Live Demo**: [https://course-taupe-alpha.vercel.app/](https://course-taupe-alpha.vercel.app/)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.x-61dafb)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#️-features)
- [Architecture](#-architecture)
- [SDLC & Development Process](#-sdlc--development-process)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

A comprehensive **Learning Management System (LMS)** built with the MERN stack, designed to facilitate online education through a modern, scalable platform. The system supports three distinct user roles—**Students**, **Educators**, and **Admins**—each with tailored dashboards and functionalities.

### Key Highlights
- 🎓 Multi-role authentication and authorization
- 📚 Course creation and management
- 💳 Enrollment and purchase tracking
- 📊 Analytics dashboards for all user types
- 🎥 Video and text-based learning content
- 📱 Responsive design for all devices

---

## ⚙️ Features

### 👩‍🎓 Student Features
- **Course Discovery**: Browse courses by category, search, and filter
- **Enrollment Management**: Enroll in courses and track progress
- **Learning Interface**: Access video/text lectures with progress tracking
- **Course
│   └── src/
│       ├── components/         # Reusable UI components
│       │   ├── student/        # Student-specific components
│       │   ├── educator/       # Educator-specific components
│       │   ├── admin/          # Admin UI components (cards, tables, modals)
│       │   └── common/         # Shared UI components across roles
│       ├── context/
│       │   └── AppContext.jsx  # Global context (auth, currency, user)
│       ├── pages/              # Application pages
│       │   ├── student/        # Student pages
│       │   ├── educator/       # Educator pages
│       │   ├── admin/          # Admin pages (AdminDashboard.jsx, ManageUsers.jsx, etc.)
│       │   └── Home.jsx        # Landing/Home page
│       ├── utils/
│       │   └── api.js          # Axios instance, token utilities
│       ├── App.jsx             # Root component
│       └── main.jsx            # Entry point for React
└── server/                     # Backend Node.js application
    ├── configs/                # Configuration files
    │   ├── mongodb.js          # MongoDB connection
    │   ├── cloudinary.js       # Cloud storage configuration
    │   └── clerk.js            # Clerk configuration (optional)
    ├── controllers/            # Route controllers (Request handlers)
    │   ├── adminController.js
    │   ├── courseController.js
    │   ├── educatorController.js
    │   ├── userController.js
    │   └── webhooks.js         # Webhook handlers (optional)
    ├── middlewares/
    │   └── authMiddleware.js   # Route protection, role-based authorization
    ├── models/                 # Mongoose schemas
    │   ├── Course.js           # Course schema
    │   ├── Purchase.js         # Purchase/Enrollment schema
    │   └── User.js             # Optional if using Clerk
    ├── routes/                 # Express routes (API routes)
    │   ├── adminRoutes.js
    │   ├── courseRoute.js
    │   ├── educatorRoutes.js
    │   ├── userRoutes.js
    │   └── index.js            # Combine all routes (optional)
    ├── utils/
    │   └── helpers.js          # Helper functions
    ├── index.js                # Main server entry point
    ├── .env                    # Environment variables
    └── package.json            # Backend dependencies and scripts


    ┌─────────────┐
          │    Home     │
          └─────┬──────┘
                │
        ┌───────┴─────────┐
        │                 │
    ┌───▼───┐         ┌───▼────┐
    │Student│         │Educator│
    └───┬───┘         └───┬────┘
        │                 │
        │         ┌───▼────────┐
        │         │EducatorDash│
        │         └────────────┘
    ┌────▼────┐
    │Courses  │
    └─────────┘
        │
    ┌────▼────┐
    │Lecture  │
    └─────────┘

    ┌───────────────┐
    │     Admin     │
    └─────┬─────────┘
          │
    ┌───────▼───────────┐
    │AdminDashboard.jsx │
    │ManageUsers.jsx    │
    │ManageCourses.jsx  │
    │ApproveEducators.jsx│
    └───────────────────┘

```

# ⚙️ Features

## 👩‍🎓 Student
- **Course browsing & search**
- **Enrollment & progress tracking**
- **Video/text lecture player**
- **Audit page** to preview courses
- **Categories, deals, and blog pages**

## 👨‍🏫 Educator
- **Add/Edit/Delete courses**
- **View enrolled students**
- **Audit approved courses**
- **Educator dashboard** for revenue & stats

## 🛡 Admin
- **Admin dashboard**: total users, total courses, total earnings
- **Approve pending educators**
- **Delete users & courses**
- **Manage all platform content**

---

# 🚀 Installation

---

## 1️⃣ Backend

### Configure `.env`

```env
PORT=5000
MONGO_URI=<Your MongoDB URI>
CLERK_SECRET_KEY=<Your Clerk Secret>

cd client
npm install
npm run dev
```

## Frontend runs on: http://localhost:5173

## Backend runs on: http://localhost:5000


# 🔑 Admin Access

- Use **Clerk** to create a user and assign role **admin**
- Access admin dashboard: `http://localhost:5173/admin/dashboard`
  
| Layer          | Technology               |
| -------------- | ------------------------ |
| Frontend       | React, TailwindCSS, Vite |
| Backend        | Node.js, Express         |
| Database       | MongoDB, Mongoose        |
| Authentication | Clerk                    |
| Storage        | Cloudinary (optional)    |
| Notifications  | React-Toastify           |
| Icons          | React-Icons              |


# 📌 Notes

- Ensure roles (**student, educator, admin**) are correctly assigned in **Clerk**
- `Purchase.js` tracks enrollments and revenue
- Admin routes are protected with middleware to prevent unauthorized access

