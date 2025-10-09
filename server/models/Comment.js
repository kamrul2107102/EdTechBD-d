import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    comment: { type: String, required: true },
    replies: [
      {
        userId: { type: String },
        reply: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
