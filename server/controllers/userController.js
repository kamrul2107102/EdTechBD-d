import Stripe from "stripe";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { Audit } from "../models/Audit.js";  

// ------------------- Audit a Course -------------------
export const auditCourse = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { courseId } = req.body;

    if (!userId || !courseId) {
      return res.json({ success: false, message: "UserId or CourseId missing" });
    }

    // Check if already audited
    const existingAudit = await Audit.findOne({ userId, courseId });
    if (existingAudit) {
      return res.json({ success: false, message: "Already audited" });
    }

    // Create audit record
    await Audit.create({ userId, courseId });

    // Add to user's enrolledCourses array for free access
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    res.json({ success: true, message: "Course audited successfully" });
  } catch (error) {
    console.error("Audit Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Get Audited Courses -------------------
export const getAuditedCourses = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const audits = await Audit.find({ userId }).populate("courseId");
    res.json({
      success: true,
      auditedCourses: audits.map((a) => a.courseId),
    });
  } catch (error) {
    console.error("Get Audited Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Get User Data -------------------
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Get User Data Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Get Enrolled Courses -------------------
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const userData = await User.findById(userId).populate("enrolledCourses");
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    console.log("User enrolledCourses array:", userData.enrolledCourses);
    console.log("Number of enrolled courses:", userData.enrolledCourses?.length);

    res.json({
      success: true,
      enrolledCourses: userData.enrolledCourses || [],
    });
  } catch (error) {
    console.error("Enrolled Courses Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Purchase Course -------------------
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth?.userId;

    if (!userId || !courseId) {
      return res.json({ success: false, message: "Missing data" });
    }

    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({ success: false, message: "User or Course not found" });
    }

    const amount = (
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100
    ).toFixed(2);

    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId,
      amount,
    });

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY || "usd";

    const line_items = [
      {
        price_data: {
          currency,
          product_data: { name: courseData.courseTitle },
          unit_amount: Math.floor(amount * 100), // cents
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items,
      mode: "payment",
      metadata: { purchaseId: newPurchase._id.toString() },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Purchase Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Update Course Progress -------------------
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { courseId, lectureId } = req.body;

    if (!userId || !courseId || !lectureId) {
      return res.json({ success: false, message: "Missing fields" });
    }

    let progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({ success: true, message: "Lecture already completed" });
      }
      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({ userId, courseId, lectureCompleted: [lectureId] });
    }

    res.json({ success: true, message: "Progress Updated" });
  } catch (error) {
    console.error("Progress Update Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Get Course Progress -------------------
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { courseId } = req.body;

    if (!userId || !courseId) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const progressData = await CourseProgress.findOne({ userId, courseId });
    res.json({ success: true, progressData: progressData || {} });
  } catch (error) {
    console.error("Get Progress Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Unenroll from Course -------------------
export const unenrollCourse = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { courseId } = req.body;

    if (!userId || !courseId) {
      return res.json({ success: false, message: "UserId or CourseId missing" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if user is enrolled
    if (!user.enrolledCourses.includes(courseId)) {
      return res.json({ success: false, message: "Not enrolled in this course" });
    }

    // Remove from enrolledCourses
    user.enrolledCourses = user.enrolledCourses.filter(
      (id) => id.toString() !== courseId.toString()
    );
    await user.save();

    // Optionally: Delete purchase record
    await Purchase.deleteOne({ userId, courseId });

    // Optionally: Delete progress
    await CourseProgress.deleteOne({ userId, courseId });

    res.json({ success: true, message: "Unenrolled successfully" });
  } catch (error) {
    console.error("Unenroll Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------- Add User Rating -------------------
export const addUserRating = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { courseId, rating } = req.body;

    if (!userId || !courseId || !rating || rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Invalid details" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.json({ success: false, message: "Course not found" });
    }

    const user = await User.findById(userId);
    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: "User has not purchased this course",
      });
    }

    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();

    res.json({ success: true, message: "Rating added" });
  } catch (error) {
    console.error("Add Rating Error:", error);
    res.json({ success: false, message: error.message });
  }
};
