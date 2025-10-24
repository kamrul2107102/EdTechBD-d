import mongoose from "mongoose";

// Question schema for interactive lessons
const questionSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    questionType: {
      type: String,
      enum: [
        "multiple-choice",
        "fill-in-blank",
        "code-completion",
        "match-pairs",
        "true-false",
      ],
      required: true,
    },
    questionText: { type: String, required: true },
    questionDescription: { type: String }, // Additional context
    codeSnippet: { type: String }, // For code-based questions
    options: [
      {
        optionId: String,
        optionText: String,
        isCorrect: Boolean,
      },
    ],
    correctAnswer: { type: String }, // For fill-in-blank
    pairs: [
      {
        left: String,
        right: String,
      },
    ], // For match-pairs
    explanation: { type: String }, // Explanation shown after answer
    points: { type: Number, default: 10 },
  },
  { _id: false }
);

// Content block schema for lesson content
const contentBlockSchema = new mongoose.Schema(
  {
    blockId: { type: String, required: true },
    blockType: {
      type: String,
      enum: ["text", "image", "code", "video", "tip", "example"],
      required: true,
    },
    content: { type: String, required: true },
    language: { type: String }, // For code blocks
    imageUrl: { type: String }, // For images
    videoUrl: { type: String }, // For videos
  },
  { _id: false }
);

// Lesson schema
const lessonSchema = new mongoose.Schema(
  {
    lessonId: { type: String, required: true, unique: true },
    courseId: { type: String, required: true }, // Reference to premium course
    sectionNumber: { type: Number, required: true },
    unitNumber: { type: Number, required: true },
    lessonTitle: { type: String, required: true },
    lessonDescription: { type: String, required: true },
    lessonType: {
      type: String,
      enum: ["lesson", "test", "practice", "reward"],
      default: "lesson",
    },
    isFree: { type: Boolean, default: false },
    estimatedTime: { type: Number }, // In minutes
    contentBlocks: [contentBlockSchema],
    questions: [questionSchema],
    requiredScore: { type: Number, default: 80 }, // Percentage to pass
    rewards: {
      xp: { type: Number, default: 50 },
      gems: { type: Number, default: 0 },
      badges: [String],
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
