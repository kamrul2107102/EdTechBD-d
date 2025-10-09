import express from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import {
  createDoubt,
  getDoubtsForCourse,
  replyToDoubt,
  markDoubtResolved,
  deleteDoubt,
  uploadAttachment,
} from "../controllers/doubtController.js";

const doubtRouter = express.Router();

// All routes require authentication
doubtRouter.post("/create", requireAuth, createDoubt);
doubtRouter.get("/course/:courseId", requireAuth, getDoubtsForCourse);
doubtRouter.post("/reply", requireAuth, replyToDoubt);
doubtRouter.post("/resolve", requireAuth, markDoubtResolved);
doubtRouter.post("/upload-attachment", requireAuth, uploadAttachment);
doubtRouter.delete("/:doubtId", requireAuth, deleteDoubt);

export default doubtRouter;
