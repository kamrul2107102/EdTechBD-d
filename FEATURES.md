# AI Powered LMS — Core Features



---

## Table of Contents

- [Student (Learner) Features](#student-learner-features)
- [Educator Features](#educator-features)
- [Admin Features](#admin-features)
- [Payments, Purchases & Webhooks](#payments-purchases--webhooks)
- [Audit / Preview System](#audit--preview-system)
- [Lessons, Quizzes & Premium Unit System](#lessons-quizzes--premium-unit-system)
- [Authentication & Authorization](#authentication--authorization)
- [Integrations & Infrastructure](#integrations--infrastructure)
- [Data Models (Summary)](#data-models-summary)
- [AI-Related Notes & Opportunities](#ai-related-notes--opportunities)
- [Utilities, Developer & Seed Data](#utilities-developer--seed-data)

---

## Student (Learner) Features

- **Course Catalog & Discovery**  
  Browse and filter courses; includes course listing and detail pages.  
  **Files:**  
  `client/src/pages/student/CoursesList.jsx`,  
  `client/src/pages/student/CourseDetails.jsx`,  
  `client/src/components/student/CourseCard.jsx`

- **Enrollment & Purchase (Premium Courses)**  
  One-time purchases to unlock premium content with Stripe integration.  
  **Files:**  
  `client/src/pages/student/PremiumMLCourse.jsx`,  
  `server/models/Purchase.js`,  
  `server/controllers/webhooks.js`

- **Audit / Course Preview**  
  Allows users to preview courses without purchase; tracked in DB.  
  **Files:**  
  `server/models/Audit.js`,  
  `client/src/pages/student/AuditPage.jsx`,  
  `client/src/pages/educator/AuditedCourses.jsx`

- **Lesson Player & Content Types**  
  Supports video, text, test, practice, and reward lessons.  
  **Files:**  
  `client/src/pages/student/LessonPlayer.jsx`,  
  `client/src/pages/student/Player.jsx`,  
  `client/src/pages/student/TextPlayer.jsx`,  
  `server/controllers/lessonController.js`

- **Progress Tracking & Gamification**  
  Track completed units and award XP, badges, and trophies.  
  **Files:**  
  `client/src/pages/student/PremiumMLCourse.jsx`,  
  `server/models/LessonProgress.js`,  
  `server/models/CourseProgress.js`

- **Comments, Ratings & Testimonials**  
  Students can rate and comment on courses.  
  **Files:**  
  `server/models/Comment.js`,  
  `server/controllers/commentController.js`,  
  `client/src/components/student/TestimonialsSection.jsx`

- **Blog & Resources**  
  Student blog and resource hub.  
  **Files:**  
  `client/src/pages/student/Blog.jsx`

---

## Educator Features

- **Educator Dashboard & Analytics**  
  Dashboard with course and enrollment metrics.  
  **Files:**  
  `client/src/pages/educator/Dashboard.jsx`,  
  `client/src/components/educator/*`

- **Course & Lesson Management**  
  Educators can create, edit, and delete courses and lessons.  
  **Files:**  
  `client/src/pages/educator/AddCourse.jsx`,  
  `client/src/pages/educator/MyCourses.jsx`,  
  `server/controllers/courseController.js`

- **Student Lists & Earnings**  
  View enrolled students and course earnings.  
  **Files:**  
  `client/src/pages/educator/StudentsEnrolled.jsx`,  
  `server/controllers/educatorController.js`

- **Audited Courses Overview**  
  See which users previewed courses.  
  **Files:**  
  `client/src/pages/educator/AuditedCourses.jsx`

---

## Admin Features

- **Admin Management & Moderation**  
  Approve educators, manage users, and control content.  
  **Files:**  
  `client/src/pages/admin/*`,  
  `server/controllers/adminController.js`

- **Platform Analytics & Dashboard**  
  Centralized stats and monitoring tools.  
  **Files:**  
  `client/src/components/admin/*`,  
  `client/src/pages/admin/AdminDashboard.jsx`

---

## Payments, Purchases & Webhooks

- **Purchase Model & Status Tracking**  
  Schema tracks purchase status (`pending`, `completed`, `failed`).  
  **File:** `server/models/Purchase.js`

- **Payment Provider Integration (Stripe)**  
  Stripe handles payments; webhooks confirm transactions.  
  **Files:**  
  `server/controllers/webhooks.js`

- **Frontend Purchase Flow**  
  Purchase modal and localStorage fallback for dev mode.  
  **File:** `client/src/pages/student/PremiumMLCourse.jsx`

---

## Audit / Preview System

- **Audit Model & API**  
  Tracks course previews per user.  
  **Files:**  
  `server/models/Audit.js`,  
  `client/src/pages/student/AuditPage.jsx`,  
  `client/src/pages/educator/AuditedCourses.jsx`

---

## Lessons, Quizzes & Premium Unit System

- **Lesson Model & Controller**  
  Metadata (unit number, content type) and fetching endpoints.  
  **Files:**  
  `server/models/Lesson.js`,  
  `server/controllers/lessonController.js`

- **Premium ML Course (Interactive Gated Learning)**  
  Sequential unlocking, tests, and reward logic.  
  **Files:**  
  `LESSON_SETUP.md`,  
  `client/src/pages/student/PremiumMLCourse.jsx`

---

## Authentication & Authorization

- **Clerk-Based Authentication**  
  Uses Clerk for user accounts; synced via webhooks.  
  **Files:**  
  `server/controllers/webhooks.js`,  
  `client/src/pages/student/PremiumMLCourse.jsx`

- **Role-Based Access & Middleware**  
  Protects routes by user role.  
  **File:** `server/middlewares/authMiddleware.js`

---

## Integrations & Infrastructure

- **Cloudinary + Multer for Uploads**  
  **Files:**  
  `server/configs/cloudinary.js`,  
  `server/configs/multer.js`

- **MongoDB Database**  
  **Files:**  
  `server/models/*`,  
  `server/configs/mongodb.js`

- **Webhook Tooling**  
  Stripe (payments) + Svix (Clerk events).  
  **File:** `server/controllers/webhooks.js`

---

## Data Models Summary

| Model | File |
|-------|------|
| User | `server/models/User.js` |
| Course | `server/models/Course.js` |
| Lesson | `server/models/Lesson.js` |
| Purchase | `server/models/Purchase.js` |
| Audit | `server/models/Audit.js` |
| CourseProgress | `server/models/CourseProgress.js` |
| LessonProgress | `server/models/LessonProgress.js` |
| Comment | `server/models/Comment.js` |
| Doubt | `server/models/Doubt.js` |

---

## AI-Related Notes & Opportunities

- **Gemini (Google Generative AI) Integration**  
  Implemented on two pages:  
  `client/src/pages/student/Home.jsx` and `client/src/pages/student/Learn.jsx`.

  ```js
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  const responseText = await result.response.text();
