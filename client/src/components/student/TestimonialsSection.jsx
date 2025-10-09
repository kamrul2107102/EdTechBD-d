import React, { useState } from "react";
import { assets, dummyTestimonial } from "../../assets/assets";
import { motion } from "framer-motion"; // animations

const TestimonialsSection = () => {
  const arrangedTestimonials = [...dummyTestimonial];
  if (arrangedTestimonials.length > 1) {
    const first = arrangedTestimonials.shift();
    const middleIndex = Math.floor(arrangedTestimonials.length / 2);
    arrangedTestimonials.splice(middleIndex, 0, first);
  }

  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <div id="testimonials" className="pb-20 px-4 md:px-16 bg-gray-50">
      {/* Section Header */}
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 text-center">
        Hear From Our Learners
      </h2>
      <p className="text-gray-500 mt-3 text-center max-w-2xl mx-auto">
        Discover how our platform has empowered learners worldwide to grow their
        skills, achieve their goals, and transform their careers. Here’s what
        they have to say about their journey.
      </p>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
        {arrangedTestimonials.map((testimonial, index) => {
          const isExpanded = expandedIndex === index;
          const displayedFeedback = isExpanded
            ? testimonial.feedback
            : testimonial.feedback.length > 120
            ? testimonial.feedback.slice(0, 120) + "..."
            : testimonial.feedback;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 overflow-hidden flex flex-col justify-between transform hover:-translate-y-1 transition-all duration-300"
            >
              {/* Top: Profile & Name */}
              <div className="flex items-center gap-4 px-6 py-4 bg-gray-100">
                <img
                  className="h-14 w-14 rounded-full object-cover"
                  src={testimonial.image}
                  alt="profile"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>

              {/* Middle: Rating & Feedback */}
              <div className="px-6 py-5 flex flex-col flex-1">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={
                        i < Math.floor(testimonial.rating)
                          ? assets.star
                          : assets.star_blank
                      }
                      alt="star"
                      className="h-5 w-5"
                    />
                  ))}
                </div>
                <p className="text-gray-500 mt-4 flex-1">{displayedFeedback}</p>
              </div>

              {/* Bottom: Read More */}
              {testimonial.feedback.length > 120 && (
                <div className="px-6 pb-5 pt-2">
                  <button
                    onClick={() =>
                      setExpandedIndex(isExpanded ? null : index)
                    }
                    className="text-blue-500 hover:text-blue-600 font-medium underline transition-all duration-200"
                  >
                    {isExpanded ? "Show Less" : "Read More"}
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TestimonialsSection;
