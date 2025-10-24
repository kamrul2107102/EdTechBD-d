import express from "express";
import {
  getCourseLessons,
  getLessonById,
  getLessonProgress,
  updateLessonProgress,
  submitLessonAnswers,
  getUserCourseProgress,
} from "../controllers/lessonController.js";

const router = express.Router();

// Get all lessons for a course
router.get("/course/:courseId", getCourseLessons);

// Get a specific lesson
router.get("/:lessonId", getLessonById);

// Get user's progress for a lesson
router.get("/progress/:userId/:lessonId", getLessonProgress);

// Update lesson progress
router.put("/progress/:userId/:lessonId", updateLessonProgress);

// Submit lesson answers
router.post("/submit/:userId/:lessonId", submitLessonAnswers);

// Get all progress for a user in a course
router.get("/progress/:userId/course/:courseId", getUserCourseProgress);

export default router;
