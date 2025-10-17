import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  const phrases = [
    "Learn at your own pace and grow your skills.",
    "Master new technologies and advance your career.",
    "Join thousands of learners achieving their goals.",
    "Upskill with top-tier instructors and content.",
  ];

  const [displayedText, setDisplayedText] = useState("");
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [typing, setTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timeout;

    if (typing) {
      if (charIndex < phrases[currentPhrase].length) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => prev + phrases[currentPhrase][charIndex]);
          setCharIndex(charIndex + 1);
        }, 100);
      } else {
        timeout = setTimeout(() => setTyping(false), 1500);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
          setCharIndex(charIndex - 1);
        }, 50);
      } else {
        setTyping(true);
        setCurrentPhrase((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, typing, currentPhrase, phrases]);

  return (
    <div className="relative w-full min-h-[85vh] md:min-h-[90vh] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Image */}
      <div className="w-full h-auto">
  <img
    src="https://img-c.udemycdn.com/notices/home_carousel_slide/image/c384c746-4a80-4e9f-8582-b0067704540b.jpg"
    alt="Hero Banner"
    className="w-full h-auto object-contain"
  />
</div>



      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 md:px-8 py-12 space-y-8 text-center max-w-6xl mx-auto">
        
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium shadow-sm border border-blue-200">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          #1 Learning Platform for Professionals
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 max-w-5xl leading-tight">
          Empower your future with courses designed to{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              fit your choice
            </span>
            <img
              src={assets.sketch}
              alt="sketch"
              className="md:block hidden absolute -bottom-3 left-0 right-0 w-full"
            />
          </span>
        </h1>

        {/* Typing effect - Desktop */}
        <div className="md:flex hidden items-center justify-center min-h-[8rem]">
          <p className="text-2xl lg:text-4xl font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent max-w-3xl">
            {displayedText}
            <span className="inline-block w-1 h-8 lg:h-12 ml-1 bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"></span>
          </p>
        </div>

        {/* Typing effect - Mobile */}
        <div className="md:hidden flex items-center justify-center min-h-[4rem]">
          <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent max-w-sm">
            {displayedText}
            <span className="inline-block w-0.5 h-6 ml-1 bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"></span>
          </p>
        </div>

        
        {/* Stats or Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 pt-8 text-gray-700">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-gray-900">10K+</p>
            <p className="text-sm md:text-base text-gray-600">Active Learners</p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-gray-900">500+</p>
            <p className="text-sm md:text-base text-gray-600">Expert Courses</p>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-gray-900">98%</p>
            <p className="text-sm md:text-base text-gray-600">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
