import express from "express";
import { requireAuth, protectAdmin } from "../middlewares/authMiddleware.js"; // ✅ শুধু এই import একটাই লাগবে

import {
  getAdminDashboard,
  approveEducator,
  deleteUser,
  deleteCourse,
  getAllUsers,
  getAllCourses,getPendingEducators,
} from "../controllers/adminController.js";

const router = express.Router();

// ✅ Dashboard Data (Only Admin)
router.get("/dashboard", requireAuth, protectAdmin, getAdminDashboard);

// ✅ All Users (Only Admin)
router.get("/users", requireAuth, protectAdmin, getAllUsers);
router.get("/pending-educators", requireAuth, protectAdmin, getPendingEducators);

// ✅ All Courses (Only Admin)
router.get("/courses", requireAuth, protectAdmin, getAllCourses);

// ✅ Approve Educator (Only Admin)
router.patch("/approve-educator/:id", requireAuth, protectAdmin, approveEducator);

// ✅ Delete User (Only Admin)
router.delete("/delete-user/:id", requireAuth, protectAdmin, deleteUser);

// ✅ Delete Course (Only Admin)
router.delete("/delete-course/:id", requireAuth, protectAdmin, deleteCourse);

export default router;
