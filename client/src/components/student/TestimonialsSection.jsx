import React, { useState } from "react";
import { assets, dummyTestimonial } from "../../assets/assets";
import { motion } from "framer-motion";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % dummyTestimonial.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + dummyTestimonial.length) % dummyTestimonial.length
    );
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div id="testimonials" className="py-10 px-4 md:px-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join thousands of learners who have transformed their careers
          </p>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 overflow-hidden">
          <div className="absolute top-0 left-0 text-gray-200 text-9xl font-serif leading-none opacity-20">
            "
          </div>

          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="relative z-10"
          >
            {/* Rating */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(dummyTestimonial[currentIndex].rating)
                      ? assets.star
                      : assets.star_blank
                  }
                  alt="star"
                  className="h-6 w-6"
                />
              ))}
            </div>

           { /* Feedback */}
                  <p className="text-gray-700 text-lg md:text-xl text-center leading-relaxed mb-8 max-w-4xl mx-auto font-normal italic">
                    "{dummyTestimonial[currentIndex].feedback}"
                  </p>

                  {/* Profile */}
            <div className="flex items-center justify-center gap-4">
              <img
                className="h-16 w-16 rounded-full object-cover border-4 border-blue-100"
                src={dummyTestimonial[currentIndex].image}
                alt={dummyTestimonial[currentIndex].name}
              />
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900">
                  {dummyTestimonial[currentIndex].name}
                </h3>
                <p className="text-gray-600">
                  {dummyTestimonial[currentIndex].role}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Next testimonial"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex justify-center gap-3 flex-wrap">
          {dummyTestimonial.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`transition-all duration-300 ${
                currentIndex === index
                  ? "ring-4 ring-blue-500 scale-110"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              <img
                className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover"
                src={testimonial.image}
                alt={testimonial.name}
              />
            </button>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div>
            <h4 className="text-4xl font-bold text-blue-600">50K+</h4>
            <p className="text-gray-600 mt-2">Active Students</p>
          </div>
          <div>
            <h4 className="text-4xl font-bold text-blue-600">4.8</h4>
            <p className="text-gray-600 mt-2">Average Rating</p>
          </div>
          <div>
            <h4 className="text-4xl font-bold text-blue-600">1000+</h4>
            <p className="text-gray-600 mt-2">Courses</p>
          </div>
          <div>
            <h4 className="text-4xl font-bold text-blue-600">95%</h4>
            <p className="text-gray-600 mt-2">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
