import mongoose from "mongoose";

// Connect to the MongoDB database
const connectDB = async () => {
  mongoose.connection.on("connected", () =>
    console.log("Database Connected Successfully")
  );

  // ✅ Use the URI directly without adding /lms, because your URI already has the database name
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDB;
