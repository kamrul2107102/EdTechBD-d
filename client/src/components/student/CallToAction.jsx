import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { useClerk, useUser } from "@clerk/clerk-react"; // useUser added
import { AppContext } from "../../context/AppContext";

const CallToAction = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser(); // Logged in user info
  const { navigate } = useContext(AppContext);

  const isLoggedIn = !!user; // true if user is logged in

  // Scroll to Testimonials section
  const scrollToTestimonials = () => {
    const section = document.getElementById("testimonials");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 pt-16 pb-28 px-6 md:px-0 bg-gradient-to-r from-gray-50 to-gray-100">
      {/* Heading */}
      <h1 className="text-2xl md:text-5xl text-gray-900 font-bold text-center leading-snug">
        Learn Anything, Anytime, Anywhere
      </h1>

      {/* Subheading */}
      <p className="text-gray-600 sm:text-base md:text-lg text-center max-w-2xl">
        Join thousands of learners worldwide who are advancing their skills
        through our platform. Experience flexible learning designed for your
        lifestyle.
      </p>

      {/* Buttons / Message */}
      {isLoggedIn ? (
        <div className="text-green-600 text-xl font-semibold flex items-center gap-2 mt-6">
          Already a member <span className="text-2xl">🎉</span>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-6">
          {/* Get Started Button */}
          <button
            onClick={() => openSignIn()} // Create account / SignIn
            className="px-12 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all duration-300 font-medium"
          >
            Get Started
          </button>

          {/* Learn More Button */}
          <button
            onClick={scrollToTestimonials} // Scroll to Testimonials
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-blue-600 border border-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
          >
            Learn More
            <img src={assets.arrow_icon} alt="arrow_icon" className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CallToAction;
