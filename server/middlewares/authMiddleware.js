// import { clerkClient } from "@clerk/express";

// // Middleware (Protect Educator Routes)
// export const protectEducator = async (req, res, next) => {
//   try {
//     const userId = req.auth.userId;
//     const response = await clerkClient.users.getUser(userId);

//     if (response.publicMetadata.role !== "educator") {
//       return res.json({ success: false, message: "Unauthorized Access" });
//     }

//     next();
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };
// middlewares/authMiddleware.js
import { clerkClient } from "@clerk/express";

// Middleware: Verify any logged-in user
export const requireAuth = async (req, res, next) => {
  try {
    const userId = req.auth.userId; // Clerk automatically populates req.auth
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await clerkClient.users.getUser(userId);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });
    req.user = user; // attach user object to req for later use
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

// Middleware (Protect Educator Routes)
export const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const response = await clerkClient.users.getUser(userId);

    if (response.publicMetadata.role !== "educator") {
      return res.status(403).json({ success: false, message: "Unauthorized Access" });
    }

    next();
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};
