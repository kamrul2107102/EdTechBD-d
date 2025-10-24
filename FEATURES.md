# AI Powered LMS — Core Features

This file is an authoritative, repo-checked list of the core features implemented (or clearly planned) in this project. Each feature includes short descriptions and direct file references where the feature is implemented or used.

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
- [Data Models (summary)](#data-models-summary)
- [AI-related notes & opportunities](#ai-related-notes--opportunities)
- [Utilities, Developer & Seed Data](#utilities-developer--seed-data)

---

## [🔗 Student (Learner) Features](#student-learner-features)

- **Course catalog & discovery**  
  - Browse and filter courses; course listing and detail pages.  
  - Files: `client/src/pages/student/CoursesList.jsx`, `client/src/pages/student/CourseDetails.jsx`, `client/src/components/student/CourseCard.jsx`

- **Enrollment & Purchase (Premium Courses)**  
  - One-time purchases to unlock premium course content. Frontend has a purchase modal and localStorage fallback; backend supports persisted purchases and webhook-based confirmation.  
  - Files: `client/src/pages/student/PremiumMLCourse.jsx`, `server/models/Purchase.js`, `server/controllers/webhooks.js` (Stripe handler)

- **Audit / Course Preview**  
  - Allows users to "audit" (preview) courses without purchasing. Audited courses are tracked and can be viewed by students and educators.  
  - Files: `server/models/Audit.js`, student page `client/src/pages/student/AuditPage.jsx`, educator view `client/src/pages/educator/AuditedCourses.jsx`

- **Lesson Player & Content Types**  
  - Support for different lesson types (lesson, test, practice, reward) and lesson player pages for video and text.  
  - Files: `client/src/pages/student/LessonPlayer.jsx`, `client/src/pages/student/Player.jsx`, `client/src/pages/student/TextPlayer.jsx`, server lesson APIs `server/controllers/lessonController.js`, `server/models/Lesson.js`

- **Progress Tracking & Gamification**  
  - Track completed units and show XP/Badges/Trophies. Sequential unlocking logic present for premium course units.  
  - Files: `client/src/pages/student/PremiumMLCourse.jsx`, `server/models/LessonProgress.js`, `server/models/CourseProgress.js`

- **Comments, Ratings & Testimonials**  
  - Comment and rating systems for courses; comment model and controller exist.  
  - Files: `server/models/Comment.js`, `server/controllers/commentController.js`, frontend components in `client/src/components/student/` (e.g., `TestimonialsSection.jsx`)

- **Blog & Resources**  
  - Blog page and supplemental resources for students.  
  - Files: `client/src/pages/student/Blog.jsx`

---

## [🔗 Educator Features](#educator-features)

- **Educator Dashboard & Analytics**  
  - Educator-facing dashboard with enrollment summaries and trend visualizations.  
  - Files: `client/src/pages/educator/Dashboard.jsx`, components in `client/src/components/educator/`

- **Course & Lesson Management**  
  - Educators can create and manage courses and lessons.  
  - Files: `client/src/pages/educator/AddCourse.jsx`, `client/src/pages/educator/MyCourses.jsx`, `server/controllers/courseController.js`, `server/routes/courseRoute.js`

- **Student Lists & Earnings**  
  - View students enrolled in courses and calculate earnings from purchases.  
  - Files: `client/src/pages/educator/StudentsEnrolled.jsx`, `server/controllers/educatorController.js` (uses `Purchase` model)

- **Audited Courses for Educators**  
  - Educators can view who audited their courses and when.  
  - Files: `client/src/pages/educator/AuditedCourses.jsx`

---

## [🔗 Admin Features](#admin-features)

- **Admin Management & Moderation**  
  - Approve educators, manage users, and manage platform content.  
  - Files: `client/src/pages/admin/*`, `server/controllers/adminController.js`, `server/routes/adminRoutes.js`

- **Platform Analytics & Admin Dashboard**  
  - Admin-level stats and management panels.  
  - Files: `client/src/components/admin/*`, `client/src/pages/admin/AdminDashboard.jsx`

---

## [🔗 Payments, Purchases & Webhooks](#payments-purchases--webhooks)

- **Purchase Model & Status**  
  - Schema with status tracking (`pending`, `completed`, `failed`), and purchase amount.  
  - Files: `server/models/Purchase.js`

- **Payment Provider Integration & Webhooks**  
  - Stripe integration for payment confirmation; webhook handler finalizes purchases and enrolls users on success. Clerk webhook handlers manage user create/update/delete events.  
  - Files: `server/controllers/webhooks.js` (functions `stripeWebhooks` and `clerkWebhooks`)

- **Frontend Purchase Flow**  
  - Purchase modal and client-side processing (localStorage simulated purchase for development). Real payment confirmed via Stripe webhooks.  
  - Files: `client/src/pages/student/PremiumMLCourse.jsx`

---

## [🔗 Audit / Preview System](#audit--preview-system)

- **Audit model & API**  
  - Tracks which users audited which courses (with timestamps).  
  - Files: `server/models/Audit.js`, API route referenced by `client/src/pages/student/AuditPage.jsx` and `client/src/pages/educator/AuditedCourses.jsx`

---

## [🔗 Lessons, Quizzes & Premium Unit System](#lessons-quizzes--premium-unit-system)

- **Complete lesson model and controller**  
  - Lesson metadata (unitNumber etc.) and endpoints to fetch lessons by course.  
  - Files: `server/models/Lesson.js`, `server/controllers/lessonController.js`

- **Premium ML Course (interactive, gated)**  
  - Duolingo-style interactive lessons described in `LESSON_SETUP.md`. Premium course UI implements sections, units, gating, tests, rewards, and sequential unlocking.  
  - Files: `LESSON_SETUP.md`, `client/src/pages/student/PremiumMLCourse.jsx`

---

## [🔗 Authentication & Authorization](#authentication--authorization)

- **Clerk-based authentication**  
  - Uses Clerk for user accounts and webhooks to sync users to the local DB.  
  - Files: `server/controllers/webhooks.js` (Clerk webhook handling), frontend `useUser()` calls (e.g., in `PremiumMLCourse.jsx`)

- **Auth middleware & role checks**  
  - Middleware for protecting routes and role-based access checks.  
  - Files: `server/middlewares/authMiddleware.js`

---

## [🔗 Integrations & Infrastructure](#integrations--infrastructure)

- **Cloudinary + multer for media uploads**  
  - Files: `server/configs/cloudinary.js`, `server/configs/multer.js`

- **Database: MongoDB**  
  - Mongoose models located under `server/models/*`; DB connection in `server/configs/mongodb.js`

- **Webhook tooling:**  
  - Svix used for Clerk verification; Stripe for payments  
  - Files: `server/controllers/webhooks.js`

---

## [🔗 Data Models (summary)](#data-models-summary)

- `User` — `server/models/User.js`  
- `Course` — `server/models/Course.js`  
- `Lesson` — `server/models/Lesson.js`  
- `Purchase` — `server/models/Purchase.js`  
- `Audit` — `server/models/Audit.js`  
- `CourseProgress`, `LessonProgress` — `server/models/CourseProgress.js`, `server/models/LessonProgress.js`  
- `Comment`, `Doubt` — `server/models/Comment.js`, `server/models/Doubt.js`

---

## [🔗 AI-related notes & opportunities](#ai-related-notes--opportunities)



## [🔗 Utilities, Developer & Seed Data](#utilities-developer--seed-data)

- **Seed scripts**  
  - Populate courses and lessons for local/dev testing.  
  - Files: `server/seed.js`, `server/seedLessons.js`

- **Environment & config**  
  - `.env.example` files exist in both `client/` and `server/` for required secrets like Stripe/Clerk keys.  
