import { Webhook } from "svix";
import User from "../models/User.js";import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }

      default:
        break;
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
export const stripeWebhooks = async (request, response) => {
  console.log("🔔 Stripe webhook received!");
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Webhook verified, event type:", event.type);
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle stripe webhooks event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId);

      if (!purchaseData) {
        console.error("Purchase data not found for purchaseId:", purchaseId);
        break;
      }

      console.log("Processing purchase:", {
        purchaseId,
        userId: purchaseData.userId,
        courseId: purchaseData.courseId
      });

      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(purchaseData.courseId);

      if (!userData) {
        console.error("User not found:", purchaseData.userId);
        break;
      }

      if (!courseData) {
        console.error("Course not found:", purchaseData.courseId);
        break;
      }

      console.log("Found user and course:", {
        userName: userData.name,
        courseName: courseData.courseTitle,
        currentEnrollments: userData.enrolledCourses.length
      });

      // EXACTLY like audit: Add course to user's enrolledCourses
      const courseIdString = purchaseData.courseId.toString();
      const alreadyEnrolled = userData.enrolledCourses.some(
        id => id.toString() === courseIdString
      );

      if (!alreadyEnrolled) {
        userData.enrolledCourses.push(purchaseData.courseId);
        await userData.save();
        console.log("✅ Successfully added course to user enrollments");
      } else {
        console.log("⚠️ User already enrolled in this course");
      }

      // Add user to course's enrolledStudents
      const userIdString = userData._id.toString();
      const alreadyInCourse = courseData.enrolledStudents.some(
        id => id.toString() === userIdString
      );

      if (!alreadyInCourse) {
        courseData.enrolledStudents.push(userData._id);
        await courseData.save();
        console.log("✅ Successfully added student to course");
      } else {
        console.log("⚠️ Student already in course");
      }

      purchaseData.status = "completed";
      await purchaseData.save();

      console.log("✅ Enrollment completed successfully for purchase:", purchaseId);

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);
      purchaseData.status = "failed";
      await purchaseData.save();

      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
};
