import mongoose from "mongoose";

const lessonProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    lessonId: { type: String, required: true },
    courseId: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    lastAttemptDate: { type: Date },
    answeredQuestions: [
      {
        questionId: String,
        userAnswer: String,
        isCorrect: Boolean,
        attemptedAt: Date,
      },
    ],
    earnedXP: { type: Number, default: 0 },
    earnedGems: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 }, // In seconds
  },
  { timestamps: true }
);

// Compound index to ensure one progress per user per lesson
lessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

const LessonProgress = mongoose.model("LessonProgress", lessonProgressSchema);

export default LessonProgress;
