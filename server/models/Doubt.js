import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    question: { type: String, required: true },
    attachments: [{ type: String }], // Array of file URLs
    replies: [
      {
        userId: { type: String },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Doubt = mongoose.model("Doubt", doubtSchema);
