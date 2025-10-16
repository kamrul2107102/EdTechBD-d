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
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 md:py-32 px-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          Trusted by 10,000+ Students Worldwide
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl text-gray-900 font-bold mb-6 leading-tight">
          Transform Your Future with
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-2">
            World-Class Education
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          Access expert-led courses, interactive learning experiences, and a global community. 
          Your journey to mastery starts here.
        </p>

        {/* Buttons / Message */}
        {isLoggedIn ? (
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
            <span className="text-3xl">🎉</span>
            <span className="text-green-700 text-lg font-semibold">
              Welcome back! Continue your learning journey
            </span>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              {/* Get Started Button */}
              <button
                onClick={() => openSignIn()}
                className="group relative px-10 py-4 rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg overflow-hidden"
              >
                <span className="relative z-10">Start Learning Today</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>

              {/* Learn More Button */}
              <button
                onClick={scrollToTestimonials}
                className="flex items-center gap-2 px-8 py-4 rounded-xl text-gray-700 bg-white border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-lg"
              >
                Explore Courses
                <img src={assets.arrow_icon} alt="arrow" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                <span>Free Trial Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                <span>Certificate of Completion</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CallToAction;
