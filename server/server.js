import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";
import doubtRouter from "./routes/doubtRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import adminRouter from "./routes/adminRoutes.js"; // ✅ (1) Admin Routes import করা হয়েছে

// Initialize Express
const app = express();

// Connect to the MongoDB database
await connectDB();
// Connect to Cloudinary

await connectCloudinary();

// Middlewares
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
  })
);
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => res.send("API Working"));
app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);
app.use("/api/doubt", express.json(), doubtRouter);
app.use("/api/comment", express.json(), commentRouter);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);
app.use("/api/admin", express.json(), adminRouter); // ✅ (2) Admin routes add করা হলো

// Portauth
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// export default app;
