import express from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { Audit } from "../models/Audit.js";
import User from "../models/User.js";

const router = express.Router();

// Get all audited courses of logged-in user
router.get("/audited-courses", requireAuth, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const audits = await Audit.find({ userId }).populate("courseId");
    const auditedCourses = audits.map(a => a.courseId);
    res.json({ success: true, auditedCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Audit a course
router.post("/audit-course", requireAuth, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.body;

    // Check if already audited
    const existingAudit = await Audit.findOne({ userId, courseId });
    if (existingAudit) return res.json({ success: false, message: "Already audited" });

    // Create audit record
    await Audit.create({ userId, courseId });

    // Add course to user's enrolledCourses
    const user = await User.findById(userId);
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    res.json({ success: true, message: "Course audited successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export default router;
