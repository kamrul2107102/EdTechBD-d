import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./models/Course.js";
import { dummyCourses } from "./coursedata.js";

dotenv.config();

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    for (const course of dummyCourses) {
      // Check if course already exists by courseTitle
      const existingCourse = await Course.findOne({ courseTitle: course.courseTitle });

      if (!existingCourse) {
        await Course.create(course);
        console.log(`Inserted course: ${course.courseTitle}`);
      } else {
        console.log(`Course already exists: ${course.courseTitle}`);
      }
    }

    console.log("Seeding completed without deleting existing data");
    process.exit();
  } catch (error) {
    console.error("Error seeding courses:", error);
    process.exit(1);
  }
};

seedCourses();
