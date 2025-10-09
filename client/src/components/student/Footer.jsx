import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { useClerk, useUser } from "@clerk/clerk-react";

const Footer = () => {
  const { openSignUp } = useClerk(); // Clerk SignUp hook
  const { user } = useUser(); // Logged-in user info
  const [email, setEmail] = useState("");

  // Subscribe button handler
  const handleSubscribe = () => {
    if (!email) {
      alert("Please enter your email!");
      return;
    }

    // Clerk SignUp modal open with prefilled email
    openSignUp({ emailAddress: email });
  };

  // Footer Logo
  const FooterLogo = () => (
    <div className="flex items-center gap-2 cursor-pointer mb-4">
      <span className="text-lg font-bold text-[rgb(23,23,232)] leading-none">
        EdTechBd
      </span>
    </div>
  );

  return (
    <footer className="bg-black text-left w-full mt-16 text-white">
      <div className="max-w-7xl mx-auto px-8 md:px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-5 border-b border-white/20">

        {/* Logo & About */}
        <div className="flex flex-col md:items-start items-center text-center md:text-left">
          <FooterLogo />
          <p className="text-sm text-white/80">
            EdTechBd connects learners with world-class instructors, interactive courses, and practical resources. Enhance your skills, expand your knowledge, and achieve your goals.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a href="#" className="hover:text-blue-500 transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-blue-400 transition"><FaTwitter /></a>
            <a href="#" className="hover:text-blue-600 transition"><FaLinkedinIn /></a>
            <a href="#" className="hover:text-pink-500 transition"><FaInstagram /></a>
          </div>
        </div>

        {/* Company Links */}
        <div className="flex flex-col md:items-start items-center text-center md:text-left">
          <h2 className="font-semibold text-white mb-5">Company</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
            <li><a href="#" className="hover:text-blue-500 transition">Home</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">About Us</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Contact Us</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Resources Links */}
        <div className="flex flex-col md:items-start items-center text-center md:text-left">
          <h2 className="font-semibold text-white mb-5">Resources</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
            <li><a href="#" className="hover:text-blue-500 transition">Blog</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Help Center</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">Courses</a></li>
            <li><a href="#" className="hover:text-blue-500 transition">FAQ</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col md:items-start items-center w-full text-center md:text-left">
          <h2 className="font-semibold text-white mb-5">Stay Updated</h2>
          <p className="text-sm text-white/80">
            Subscribe to receive weekly updates on new courses, articles, and skill-building tips.
          </p>

          {/* Only show input + button if user is not logged in */}
          {!user && (
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-4 w-full max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-500/30 bg-gray-800 text-white placeholder-gray-500 outline-none w-full sm:flex-1 h-10 rounded px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSubscribe}
                className="bg-blue-600 w-full sm:w-28 h-10 text-white rounded hover:bg-blue-700 transition"
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="py-2 text-center text-xs md:text-sm text-white/60">
        © 2025 EdTechBd. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
