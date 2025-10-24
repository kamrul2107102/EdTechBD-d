# Premium ML Course - Interactive Lessons Setup

## Overview
This implementation adds Duolingo-style interactive lessons to the Premium Machine Learning Certification Course.

## Database Models

### 1. Lesson Model (`server/models/Lesson.js`)
Stores interactive lesson content including:
- Content blocks (text, images, code, tips, examples)
- Questions (multiple-choice, fill-in-blank, code-completion, true-false)
- Rewards (XP, gems, badges)
- Section and unit organization

### 2. LessonProgress Model (`server/models/LessonProgress.js`)
Tracks user progress through lessons:
- Completion status
- Score and attempts
- Answered questions
- Earned rewards

## API Endpoints

### Lesson Routes (`/api/lesson`)
- `GET /course/:courseId` - Get all lessons for a course
- `GET /:lessonId` - Get a specific lesson
- `GET /progress/:userId/:lessonId` - Get user's lesson progress
- `PUT /progress/:userId/:lessonId` - Update lesson progress
- `POST /submit/:userId/:lessonId` - Submit lesson answers
- `GET /progress/:userId/course/:courseId` - Get all user progress for a course

## Setup Instructions

### Step 1: Install Dependencies (if not already installed)
```bash
cd server
npm install axios
```

### Step 2: Seed the Database
Run the seed script to populate the database with sample lessons:

```bash
cd server
node seedLessons.js
```

This will create 4 sample lessons:
1. **Introduction to ML** (Section 1, Unit 0) - FREE
2. **Data Preprocessing** (Section 2, Unit 1) - PREMIUM
3. **Unit Checkpoint** (Section 2, Unit 2) - PREMIUM (Test)
4. **Linear Regression** (Section 3, Unit 3) - PREMIUM

### Step 3: Start the Backend Server
```bash
cd server
npm run server
```

### Step 4: Start the Frontend
```bash
cd client
npm run dev
```

## Features

### Interactive Lesson Player
- **Step-by-step learning** - Content blocks and questions presented sequentially
- **Multiple question types**:
  - Multiple choice
  - True/False
  - Fill in the blank
  - Code completion
- **Instant feedback** - Shows explanations after each answer
- **Progress tracking** - Visual progress bar
- **Rewards system** - Earn XP and gems for completing lessons
- **Results screen** - Summary with score and earned rewards

### Content Block Types
1. **Text** - Markdown-formatted text with headings
2. **Image** - Visual content with captions
3. **Code** - Syntax-highlighted code snippets
4. **Tip** - Helpful hints in blue boxes
5. **Example** - Real-world examples in purple boxes

### Access Control
- First lesson (Unit 0) is **FREE** for all users
- Units 1-8 require **$5 purchase**
- Purchase persists in localStorage (keyed by user ID)

## Usage Flow

1. User navigates to `/learn/premium-ml`
2. Clicks on "Getting Started" (FREE lesson)
3. Redirected to `/lesson/ml-cert-lesson-01`
4. Goes through content blocks and answers questions
5. Receives instant feedback on each answer
6. Completes lesson and sees results
7. Earns XP and gems if passed
8. Returns to course path to continue

## Adding More Lessons

To add more lessons, edit `server/seedLessons.js` and add new lesson objects following this structure:

```javascript
{
  lessonId: "ml-cert-lesson-XX",
  courseId: "ml-certification-course",
  sectionNumber: X,
  unitNumber: X,
  lessonTitle: "Your Lesson Title",
  lessonDescription: "Description",
  lessonType: "lesson", // or "test", "practice", "reward"
  isFree: false, // true for free lessons
  estimatedTime: 20, // in minutes
  contentBlocks: [
    {
      blockId: "block-XX",
      blockType: "text", // or "image", "code", "tip", "example"
      content: "Your content here",
    }
  ],
  questions: [
    {
      questionId: "qXX",
      questionType: "multiple-choice",
      questionText: "Your question?",
      options: [
        { optionId: "a", optionText: "Option A", isCorrect: true },
        { optionId: "b", optionText: "Option B", isCorrect: false },
      ],
      explanation: "Explanation here",
      points: 10,
    }
  ],
  requiredScore: 80,
  rewards: { xp: 50, gems: 5, badges: [] }
}
```

Then run the seed script again:
```bash
node seedLessons.js
```

## File Structure

```
server/
├── models/
│   ├── Lesson.js           # Lesson schema
│   └── LessonProgress.js   # Progress tracking schema
├── controllers/
│   └── lessonController.js # Lesson API logic
├── routes/
│   └── lessonRoutes.js     # Lesson endpoints
├── seedLessons.js          # Database seeding script
└── server.js               # Main server (updated)

client/src/
├── pages/student/
│   ├── PremiumMLCourse.jsx # Course path (updated)
│   └── LessonPlayer.jsx    # Interactive lesson player
└── App.jsx                 # Routes (updated)
```

## Next Steps

1. ✅ Run seed script to populate lessons
2. ✅ Test the first free lesson
3. ✅ Test purchase flow for premium lessons
4. 🔄 Add more lessons by editing seedLessons.js
5. 🔄 Integrate real payment gateway (Stripe/PayPal)
6. 🔄 Store purchase in backend database instead of localStorage
7. 🔄 Add certificate generation after course completion

## Notes

- Lessons are stored in MongoDB
- Content is fully customizable through the database
- Questions support multiple formats
- Progress is tracked per user
- Rewards can be used for gamification

