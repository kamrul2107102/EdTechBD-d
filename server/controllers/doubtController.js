import { Doubt } from "../models/Doubt.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

// ------------------- Create Doubt -------------------
export const createDoubt = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { courseId, question, attachments } = req.body;

    if (!userId || !courseId || !question) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const newDoubt = await Doubt.create({
      userId,
      courseId,
      question,
      attachments: attachments || [],
    });

    res.json({ success: true, message: "Doubt submitted successfully", doubt: newDoubt });
  } catch (error) {
    console.error("Create Doubt Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Get Doubts for Course -------------------
export const getDoubtsForCourse = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { courseId } = req.params;

    if (!userId || !courseId) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const doubts = await Doubt.find({ courseId }).sort({ createdAt: -1 });

    // Manually populate user data
    const populatedDoubts = await Promise.all(
      doubts.map(async (doubt) => {
        const user = await User.findById(doubt.userId);
        const repliesWithUsers = await Promise.all(
          doubt.replies.map(async (reply) => {
            const replyUser = await User.findById(reply.userId);
            return {
              ...reply.toObject(),
              userId: replyUser ? { name: replyUser.name, imageUrl: replyUser.imageUrl } : null,
            };
          })
        );
        return {
          ...doubt.toObject(),
          userId: user ? { _id: user._id, name: user.name, imageUrl: user.imageUrl } : null,
          replies: repliesWithUsers,
        };
      })
    );

    res.json({ success: true, doubts: populatedDoubts });
  } catch (error) {
    console.error("Get Doubts Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Reply to Doubt -------------------
export const replyToDoubt = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { doubtId, message } = req.body;

    if (!userId || !doubtId || !message) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.json({ success: false, message: "Doubt not found" });
    }

    doubt.replies.push({ userId, message });
    await doubt.save();

    // Manually populate user data
    const user = await User.findById(doubt.userId);
    const repliesWithUsers = await Promise.all(
      doubt.replies.map(async (reply) => {
        const replyUser = await User.findById(reply.userId);
        return {
          ...reply.toObject(),
          userId: replyUser ? { name: replyUser.name, imageUrl: replyUser.imageUrl } : null,
        };
      })
    );

    const populatedDoubt = {
      ...doubt.toObject(),
      userId: user ? { _id: user._id, name: user.name, imageUrl: user.imageUrl } : null,
      replies: repliesWithUsers,
    };

    res.json({ success: true, message: "Reply added", doubt: populatedDoubt });
  } catch (error) {
    console.error("Reply Doubt Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Mark Doubt as Resolved -------------------
export const markDoubtResolved = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { doubtId } = req.body;

    if (!userId || !doubtId) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.json({ success: false, message: "Doubt not found" });
    }

    // Only the doubt creator can mark it as resolved
    if (doubt.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    doubt.isResolved = true;
    await doubt.save();

    res.json({ success: true, message: "Doubt marked as resolved" });
  } catch (error) {
    console.error("Mark Resolved Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Upload Attachment -------------------
export const uploadAttachment = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const imageFile = req.body.image;

    if (!userId || !imageFile) {
      return res.json({ success: false, message: "Missing image file" });
    }

    const imageUpload = await cloudinary.uploader.upload(imageFile, {
      resource_type: "image",
      folder: "doubts",
    });

    res.json({ success: true, url: imageUpload.secure_url });
  } catch (error) {
    console.error("Upload Attachment Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Delete Doubt -------------------
export const deleteDoubt = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { doubtId } = req.params;

    if (!userId || !doubtId) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.json({ success: false, message: "Doubt not found" });
    }

    // Only the doubt creator can delete it
    if (doubt.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await Doubt.findByIdAndDelete(doubtId);

    res.json({ success: true, message: "Doubt deleted successfully" });
  } catch (error) {
    console.error("Delete Doubt Error:", error);
    res.json({ success: false, message: error.message });
  }
};
