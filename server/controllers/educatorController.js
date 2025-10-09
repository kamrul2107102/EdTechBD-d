import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import { Doubt } from "../models/Doubt.js";

// Update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    res.json({ success: true, message: "You can publish a course now" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add New Course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail Not Attached" });
    }

    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    const newCourse = await Course.create(parsedCourseData);

    // Upload image to cloudinary from buffer
    const imageUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "lms-uploads", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(imageFile.buffer);
    });

    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.json({ success: true, message: "Course Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Dashboard Data (Total Earning, Enrolled Students, No. of Courses)
export const educatorDashboard = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    // Calculate total earnings from purchases
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // Collect unique enrolled student IDs with their course titles
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Enrolled Studentd Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get All Doubts for Educator's Courses
export const getEducatorDoubts = async (req, res) => {
  try {
    const educatorId = req.auth?.userId;
    console.log("Educator ID:", educatorId);

    if (!educatorId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Find all courses by this educator
    const educatorCourses = await Course.find({ educator: educatorId }).select("_id courseTitle");
    console.log("Educator courses found:", educatorCourses.length);
    const courseIds = educatorCourses.map((course) => course._id.toString());
    console.log("Course IDs (string):", courseIds);

    // Find all doubts for these courses
    let doubts = await Doubt.find({ courseId: { $in: courseIds } }).sort({ createdAt: -1 });
    console.log("Raw doubts found with string match:", doubts.length);

    // If no doubts found, debug by checking all doubts
    if (doubts.length === 0) {
      console.log("No doubts found with string IDs, checking all doubts...");
      const allDoubts = await Doubt.find({}).sort({ createdAt: -1 });
      console.log("Total doubts in DB:", allDoubts.length);
      if (allDoubts.length > 0) {
        console.log("Sample doubt courseId:", allDoubts[0]?.courseId);
        console.log("Sample doubt courseId type:", typeof allDoubts[0]?.courseId);
      }

      // Filter doubts manually
      doubts = allDoubts.filter(doubt =>
        courseIds.includes(doubt.courseId) ||
        courseIds.includes(doubt.courseId?.toString())
      );
      console.log("Filtered doubts after manual check:", doubts.length);
    }

    // Manually populate user data and course data
    const populatedDoubts = await Promise.all(
      doubts.map(async (doubt) => {
        const user = await User.findById(doubt.userId);
        const course = await Course.findById(doubt.courseId).select("courseTitle");
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
          courseId: course ? { _id: course._id, courseTitle: course.courseTitle } : null,
          replies: repliesWithUsers,
        };
      })
    );

    res.json({ success: true, doubts: populatedDoubts });
  } catch (error) {
    console.error("Get Educator Doubts Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Delete Course
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const educatorId = req.auth.userId;

    // Find the course and verify ownership
    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({ success: false, message: "Course not found" });
    }

    if (course.educator !== educatorId) {
      return res.json({ success: false, message: "Unauthorized to delete this course" });
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    res.json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
