import express from "express";
import {
  addCourse,
  educatorDashboard,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator,
  getEducatorDoubts,
  deleteCourse,
} from "../controllers/educatorController.js";
import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";
import { requireAuth } from "@clerk/express";


const educatorRouter = express.Router();

// Add Educator Role
educatorRouter.get("/update-role", updateRoleToEducator);
educatorRouter.post(
  "/add-course",
  upload.single("image"),
  protectEducator,
  addCourse
);
educatorRouter.get("/courses", protectEducator, getEducatorCourses);
educatorRouter.get("/dashboard", protectEducator, educatorDashboard);
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData
);
educatorRouter.get("/doubts", protectEducator, getEducatorDoubts);
educatorRouter.delete("/course/:courseId", protectEducator, deleteCourse);

export default educatorRouter;
