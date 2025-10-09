import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    userId: { type: String, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Audit = mongoose.model("Audit", AuditSchema);
