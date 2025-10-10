import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";

// ✅ Get Admin Dashboard Data
export const getAdminDashboard = async (req, res) => {
  try {
    const users = await clerkClient.users.getUserList();
    const allUsers = users.data || [];

    // Educator ও pending educator আলাদা করো
    const educators = allUsers.filter(
      (u) => u.publicMetadata.role === "educator"
    );
    const pendingEducators = allUsers.filter(
      (u) => u.publicMetadata.role === "pendingEducator"
    );

    // মোট ইউজার, কোর্স, আয়ের হিসাব
    const totalUsers = allUsers.length;
    const totalCourses = await Course.countDocuments();
    const totalEarnings = await Purchase.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // কোর্সগুলো আনো
    const courses = await Course.find().populate("educator", "name email");

    res.json({
      success: true,
      dashboardData: {
        totalUsers,
        totalCourses,
        totalEarnings:
          totalEarnings.length > 0 ? totalEarnings[0].total : 0,
        pendingEducators: pendingEducators.map((u) => ({
          _id: u.id,
          name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
          email: u.emailAddresses[0]?.emailAddress,
        })),
        courses: courses.map((c) => ({
          _id: c._id,
          courseTitle: c.courseTitle,
          coursePrice: c.coursePrice,
          educatorName: c.educator?.name || "Unknown",
        })),
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// ✅ Get Pending Educators (for ApproveEducators.jsx)
export const getPendingEducators = async (req, res) => {
    try {
      const users = await clerkClient.users.getUserList();
      const allUsers = users.data || [];
  
      const pendingEducators = allUsers.filter(
        (u) => u.publicMetadata.role === "pendingEducator"
      );
  
      res.json({
        success: true,
        educators: pendingEducators.map((u) => ({
          _id: u.id,
          name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
          email: u.emailAddresses[0]?.emailAddress,
        })),
      });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };
  
// ✅ Approve Educator
export const approveEducator = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await clerkClient.users.updateUser(id, {
      publicMetadata: { role: "educator" },
    });
    res.json({
      success: true,
      message: "Educator approved successfully",
      updatedUser,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Courses (for ManageCourses.jsx)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("educator", "name email");
    res.json({
      success: true,
      courses: courses.map((c) => ({
        _id: c._id,
        courseTitle: c.courseTitle,
        coursePrice: c.coursePrice,
        educatorName: c.educator?.name || "Unknown",
      })),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await clerkClient.users.deleteUser(id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Delete Course
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Users (for ManageUsers page)
export const getAllUsers = async (req, res) => {
  try {
    const users = await clerkClient.users.getUserList();

    const allUsers = users.data.map((u) => ({
      _id: u.id,
      name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
      email: u.emailAddresses[0]?.emailAddress,
      role: u.publicMetadata.role || "student",
      createdAt: u.createdAt,
    }));

    res.json({ success: true, users: allUsers });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
