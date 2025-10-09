import { Comment } from "../models/Comment.js";
import User from "../models/User.js";

// ------------------- Add Comment -------------------
export const addComment = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { courseId, comment } = req.body;

    if (!userId || !courseId || !comment) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const newComment = await Comment.create({
      userId,
      courseId,
      comment,
    });

    res.json({ success: true, message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Add Comment Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Get Comments for Course -------------------
export const getCommentsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.json({ success: false, message: "Course ID missing" });
    }

    const comments = await Comment.find({ courseId }).sort({ createdAt: -1 });

    // Manually populate user data
    const populatedComments = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findById(comment.userId);
        const repliesWithUsers = await Promise.all(
          comment.replies.map(async (reply) => {
            const replyUser = await User.findById(reply.userId);
            return {
              ...reply.toObject(),
              userId: replyUser ? { name: replyUser.name, imageUrl: replyUser.imageUrl } : null,
            };
          })
        );
        return {
          ...comment.toObject(),
          userId: user ? { _id: user._id, name: user.name, imageUrl: user.imageUrl } : null,
          replies: repliesWithUsers,
        };
      })
    );

    res.json({ success: true, comments: populatedComments });
  } catch (error) {
    console.error("Get Comments Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Reply to Comment -------------------
export const replyToComment = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { commentId, reply } = req.body;

    if (!userId || !commentId || !reply) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.json({ success: false, message: "Comment not found" });
    }

    comment.replies.push({ userId, reply });
    await comment.save();

    // Manually populate user data
    const user = await User.findById(comment.userId);
    const repliesWithUsers = await Promise.all(
      comment.replies.map(async (reply) => {
        const replyUser = await User.findById(reply.userId);
        return {
          ...reply.toObject(),
          userId: replyUser ? { name: replyUser.name, imageUrl: replyUser.imageUrl } : null,
        };
      })
    );

    const populatedComment = {
      ...comment.toObject(),
      userId: user ? { _id: user._id, name: user.name, imageUrl: user.imageUrl } : null,
      replies: repliesWithUsers,
    };

    res.json({ success: true, message: "Reply added", comment: populatedComment });
  } catch (error) {
    console.error("Reply Comment Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Delete Comment -------------------
export const deleteComment = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { commentId } = req.params;

    if (!userId || !commentId) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.json({ success: false, message: "Comment not found" });
    }

    // Only the comment creator can delete it
    if (comment.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    res.json({ success: false, message: error.message });
  }
};
