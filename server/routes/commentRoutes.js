import express from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import {
  addComment,
  getCommentsForCourse,
  replyToComment,
  deleteComment,
} from "../controllers/commentController.js";

const commentRouter = express.Router();

// All routes require authentication
commentRouter.post("/add", requireAuth, addComment);
commentRouter.get("/course/:courseId", getCommentsForCourse);
commentRouter.post("/reply", requireAuth, replyToComment);
commentRouter.delete("/:commentId", requireAuth, deleteComment);

export default commentRouter;
