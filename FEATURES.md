# AI Powered LMS — Core Features

This file is an authoritative, repo-checked list of the core features implemented (or clearly planned) in this project. Each feature includes short descriptions and direct file references where the feature is implemented or used.

---

## Student (Learner) Features

- Course catalog & discovery
  - Browse and filter courses; course listing and detail pages.
  - Files: `client/src/pages/student/CoursesList.jsx`, `client/src/pages/student/CourseDetails.jsx`, `client/src/components/student/CourseCard.jsx`

- Enrollment & Purchase (Premium Courses)
  - One-time purchases to unlock premium course content. Frontend has a purchase modal and localStorage fallback; backend supports persisted purchases and webhook-based confirmation.
  - Files: `client/src/pages/student/PremiumMLCourse.jsx`, `server/models/Purchase.js`, `server/controllers/webhooks.js` (Stripe handler)

- Audit / Course Preview
  - Allows users to "audit" (preview) courses without purchasing. Audited courses are tracked and can be viewed by students and educators.
  - Files: `server/models/Audit.js`, student page `client/src/pages/student/AuditPage.jsx`, educator view `client/src/pages/educator/AuditedCourses.jsx`

- Lesson Player & Content Types
  - Support for different lesson types (lesson, test, practice, reward) and lesson player pages for video and text.
  - Files: `client/src/pages/student/LessonPlayer.jsx`, `client/src/pages/student/Player.jsx`, `client/src/pages/student/TextPlayer.jsx`, server lesson APIs `server/controllers/lessonController.js`, `server/models/Lesson.js`

- Progress Tracking & Gamification
  - Track completed units and show XP/Badges/Trophies. Sequential unlocking logic present for premium course units.
  - Files: `client/src/pages/student/PremiumMLCourse.jsx`, `server/models/LessonProgress.js`, `server/models/CourseProgress.js`

- Comments, Ratings & Testimonials
  - Comment and rating systems for courses; comment model and controller exist.
  - Files: `server/models/Comment.js`, `server/controllers/commentController.js`, frontend components in `client/src/components/student/` (e.g., `TestimonialsSection.jsx`)

- Blog & Resources
  - Blog page and supplemental resources for students.
  - Files: `client/src/pages/student/Blog.jsx`

## Educator Features

- Educator Dashboard & Analytics
  - Educator-facing dashboard with enrollment summaries and trend visualizations.
  - Files: `client/src/pages/educator/Dashboard.jsx`, components in `client/src/components/educator/`

- Course & Lesson Management
  - Educators can create and manage courses and lessons.
  - Files: `client/src/pages/educator/AddCourse.jsx`, `client/src/pages/educator/MyCourses.jsx`, `server/controllers/courseController.js`, `server/routes/courseRoute.js`

- Student Lists & Earnings
  - View students enrolled in courses and calculate earnings from purchases.
  - Files: `client/src/pages/educator/StudentsEnrolled.jsx`, `server/controllers/educatorController.js` (uses `Purchase` model)

- Audited Courses for Educators
  - Educators can view who audited their courses and when.
  - Files: `client/src/pages/educator/AuditedCourses.jsx`

## Admin Features

- Admin Management & Moderation
  - Approve educators, manage users, and manage platform content.
  - Files: `client/src/pages/admin/*`, `server/controllers/adminController.js`, `server/routes/adminRoutes.js`

- Platform Analytics & Admin Dashboard
  - Admin-level stats and management panels.
  - Files: `client/src/components/admin/*`, `client/src/pages/admin/AdminDashboard.jsx`

## Payments, Purchases & Webhooks

- Purchase Model & Status
  - Schema with status tracking (`pending`, `completed`, `failed`), and purchase amount.
  - Files: `server/models/Purchase.js`

- Payment Provider Integration & Webhooks
  - Stripe integration for payment confirmation; webhook handler finalizes purchases and enrolls users on success. Clerk webhook handlers manage user create/update/delete events.
  - Files: `server/controllers/webhooks.js` (functions `stripeWebhooks` and `clerkWebhooks`)

- Frontend Purchase Flow
  - Purchase modal and client-side processing (localStorage simulated purchase for development). Real payment confirmed via Stripe webhooks.
  - Files: `client/src/pages/student/PremiumMLCourse.jsx`

## Audit / Preview System

- Audit model & API
  - Tracks which users audited which courses (with timestamps).
  - Files: `server/models/Audit.js`, API route referenced by `client/src/pages/student/AuditPage.jsx` and `client/src/pages/educator/AuditedCourses.jsx`

## Lessons, Quizzes & Premium Unit System

- Complete lesson model and controller
  - Lesson metadata (unitNumber etc.) and endpoints to fetch lessons by course.
  - Files: `server/models/Lesson.js`, `server/controllers/lessonController.js`

- Premium ML Course (interactive, gated)
  - Duolingo-style interactive lessons described in `LESSON_SETUP.md`. Premium course UI implements sections, units, gating, tests, rewards, and sequential unlocking.
  - Files: `LESSON_SETUP.md`, `client/src/pages/student/PremiumMLCourse.jsx`

## Authentication & Authorization

- Clerk-based authentication
  - Uses Clerk for user accounts and webhooks to sync users to the local DB.
  - Files: `server/controllers/webhooks.js` (Clerk webhook handling), frontend `useUser()` calls (e.g., in `PremiumMLCourse.jsx`)

- Auth middleware & role checks
  - Middleware for protecting routes and role-based access checks.
  - Files: `server/middlewares/authMiddleware.js`

## Integrations & Infrastructure

- Cloudinary + multer for media uploads
  - Files: `server/configs/cloudinary.js`, `server/configs/multer.js`

- Database: MongoDB
  - Mongoose models located under `server/models/*`; DB connection in `server/configs/mongodb.js`

- Webhook tooling: Svix used for Clerk verification; Stripe for payments
  - Files: `server/controllers/webhooks.js`

## Data Models (summary)

- `User` — `server/models/User.js`
- `Course` — `server/models/Course.js`
- `Lesson` — `server/models/Lesson.js`
- `Purchase` — `server/models/Purchase.js`
- `Audit` — `server/models/Audit.js`
- `CourseProgress`, `LessonProgress` — `server/models/CourseProgress.js`, `server/models/LessonProgress.js`
- `Comment`, `Doubt` — `server/models/Comment.js`, `server/models/Doubt.js`

## AI-related notes & opportunities

- Current repo findings:
  - The repository DOES include a direct frontend integration with Google Gemini in two pages:
    - `client/src/pages/student/Home.jsx` — chat UI and Gemini usage (imports `GoogleGenerativeAI` and calls `genAI.getGenerativeModel({ model: "gemini-2.0-flash" })` and `generateContent`).
    - `client/src/pages/student/Learn.jsx` — similar chat UI and Gemini usage (same library, model and flow).
  - The implementation uses the `@google/generative-ai` client in the browser and constructs prompts, receives responses, and renders them in a floating chat assistant.
  - The chat assistant is labeled "AI Study Buddy" / "AI Learning Assistant" and the UI shows "Powered by Gemini AI".

- Implementation details (what I found in code):
  - Library: `@google/generative-ai` imported in the frontend pages.
  - Model: `gemini-2.0-flash` selected via `genAI.getGenerativeModel({ model: "gemini-2.0-flash" })`.
  - API calls: `model.generateContent(prompt)` is used to get responses; the code then calls `result.response.text()` to extract textual output.
  - Prompting: prompts include context about the platform (EdTechBD) and the user's question to make responses context-aware.
  - UI locations: floating chat button, chat window, formatted message rendering (bullet lists, numbered lists, bold, inline `code`).

- Security & operational risks — ACTION REQUIRED:
  - I found a hard-coded API key in the frontend files (`const API_KEY = "AIzaSyDhszWuhkQExiMiacdSoFf27RYqJOXANmY"`). This is a high-risk secret exposure.
    - Publicly committed API keys allow anyone to use your Google Cloud quota and can lead to unexpected charges, quota exhaustion, or account suspension.
  - Recommended immediate actions:
    1. Remove the key from the frontend, rotate (revoke) the exposed key in Google Cloud immediately.
    2. Move all calls that require a private API key to a backend endpoint (server-side) that holds the key in environment variables (`process.env.GOOGLE_API_KEY`).
    3. Implement server-side rate limits and usage logging; do not call GEMINI directly from client code with a secret key.
    4. Add input sanitization and length limits on prompts to control token usage and safety filtering.




## Utilities, Developer & Seed Data

- Seed scripts to populate courses and lessons for local/dev testing.
  - Files: `server/seed.js`, `server/seedLessons.js`

- Environment & config
  - `.env.example` files exist in both `client/` and `server/` for required secrets like Stripe/Clerk keys.

---

## Quick references

- Premium course UI: `client/src/pages/student/PremiumMLCourse.jsx`
- Stripe + Clerk webhooks: `server/controllers/webhooks.js`
- Audit model: `server/models/Audit.js`
- Purchase model: `server/models/Purchase.js`
- Lesson setup notes: `LESSON_SETUP.md`

---

