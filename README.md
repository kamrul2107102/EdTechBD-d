LMS MERN WEBSITE 
vercel: https://course-taupe-alpha.vercel.app/
# LMS - Learning Management System

A modern Learning Management System (LMS) built with **React** (frontend) and **Node.js/Express** (backend), integrated with **MongoDB** and **Clerk** for user authentication. The platform supports **Students, Educators, and Admins** with role-based access and dashboard functionalities.

---

## 🎨 Design & UI Structure

The application is divided into three main user roles with separate dashboards:

### 1. Student
- Browse & enroll in courses
- View enrolled courses
- Access lectures (video/text)
- View categories, deals, and blog posts
- Audit courses

### 2. Educator
- Create and manage courses
- Track student enrollments
- Review audited courses
- Dashboard for earnings and statistics

### 3. Admin
- Full control over platform data
- Dashboard showing users, courses, and earnings
- Approve educator requests
- Manage users and courses
- Role-based access using **Clerk**

---

## 🗂 Project Structure

# Project Structure

This document outlines the directory structure of the project, including both the frontend (React) and backend (Node.js/Express) components.

---

# Frontend/Client (React) Project Structure

client/
├── public/                     # Static assets (images, favicon, etc.)
└── src/
    ├── components/             # Reusable UI components
    │   ├── student/            # Student-specific components
    │   ├── educator/           # Educator-specific components
    │   ├── admin/              # Admin UI components (cards, tables, modals)
    │   └── common/             # Shared UI components across roles
    ├── context/
    │   └── AppContext.jsx      # Global context (auth, currency, user)
    ├── pages/                  # Application pages
    │   ├── student/            # Student pages
    │   ├── educator/           # Educator pages
    │   ├── admin/              # Admin pages
    │   │   ├── AdminDashboard.jsx
    │   │   ├── ManageUsers.jsx
    │   │   ├── ManageCourses.jsx
    │   │   └── ApproveEducators.jsx
    │   └── Home.jsx            # Landing/Home page
    ├── utils/
    │   └── api.js              # Axios instance, token utilities
    ├── App.jsx                 # Root component
    ├── main.jsx                # Entry point for React
    └── index.css               # Global styles


# Backend (Node.js/Express) Project Structure

server/
├── configs/                    # Configuration files
│   ├── mongodb.js              # MongoDB connection
│   ├── cloudinary.js           # Cloud storage configuration
│   └── clerk.js                # Clerk configuration (optional)
├── controllers/                # Route controllers
│   ├── adminController.js      # Admin dashboard, approve/delete functionality
│   ├── courseController.js     # Course-related operations
│   ├── educatorController.js   # Educator-related operations
│   ├── userController.js       # User operations
│   └── webhooks.js             # Webhook handlers (optional)
├── middlewares/
│   └── authMiddleware.js       # Route protection, role-based authorization
├── models/                     # Mongoose schemas
│   ├── Course.js               # Course schema
│   ├── Purchase.js             # Purchase/Enrollment schema
│   └── User.js                 # Optional if using Clerk
├── routes/                     # Express routes
│   ├── adminRoutes.js          # Admin APIs
│   ├── courseRoute.js          # Course APIs
│   ├── educatorRoutes.js       # Educator APIs
│   ├── userRoutes.js           # User APIs
│   └── index.js (optional)     # Combine all routes
├── utils/
│   └── helpers.js              # Helper functions
├── index.js                    # Main server entry point
├── .env                        # Environment variables
└── package.json                # Backend dependencies and scripts



## 🔗 Visual Diagram

```text
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
        │             ┌───▼────────┐
        │             │EducatorDash│
        │             └────────────┘
        │
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
⚙️ Features
Student

Course browsing & search

Enrollment & progress tracking

Video/text lecture player

Audit page to preview courses

Categories, deals, and blog pages

Educator

Add/Edit/Delete courses

View enrolled students

Audit approved courses

Educator dashboard for revenue & stats

Admin

Admin dashboard: total users, total courses, total earnings

Approve pending educators

Delete users & courses

Manage all platform content

🚀 Installation
1. Backend
cd server
npm install


Configure .env:

PORT=5000
MONGO_URI=<Your MongoDB URI>
CLERK_SECRET_KEY=<Your Clerk Secret>


Start server:

npm run dev

2. Frontend
cd client
npm install
npm run dev


Frontend runs on http://localhost:5173
Backend runs on http://localhost:5000

🔑 Admin Access

Use Clerk to create a user and assign role admin

Access admin dashboard:

http://localhost:5173/admin/dashboard

🛠 Tech Stack
Layer	Technology
Frontend	React, TailwindCSS, Vite
Backend	Node.js, Express
Database	MongoDB, Mongoose
Auth	Clerk
Storage	Cloudinary (optional)
Notifications	React-Toastify
Icons	React-Icons
📌 Notes

Ensure roles (student, educator, admin) are correctly assigned in Clerk.

Purchase.js tracks enrollments and revenue.

Admin routes are protected with middleware to prevent unauthorized access
