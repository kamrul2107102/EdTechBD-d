import express from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import {
  addUserRating,
  getUserCourseProgress,
  getUserData,
  purchaseCourse,
  updateUserCourseProgress,
  userEnrolledCourses,
  auditCourse,
  getAuditedCourses,
  unenrollCourse,
} from "../controllers/userController.js";

const userRouter = express.Router();

// User basic routes
userRouter.get("/data", getUserData);
userRouter.get("/enrolled-courses", userEnrolledCourses);
userRouter.post("/purchase", purchaseCourse);

// Course progress & ratings
userRouter.post("/update-course-progress", updateUserCourseProgress);
userRouter.post("/get-course-progress", getUserCourseProgress);
userRouter.post("/add-rating", addUserRating);

// Audit routes
userRouter.post("/audit-course", requireAuth, auditCourse);
userRouter.get("/audited-courses", requireAuth, getAuditedCourses);

// Unenroll route
userRouter.post("/unenroll-course", requireAuth, unenrollCourse);

export default userRouter;
