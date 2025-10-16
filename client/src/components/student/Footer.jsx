import React, { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { useClerk, useUser } from "@clerk/clerk-react";

const Footer = () => {
  const { openSignUp } = useClerk();
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowCookieConsent(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    document.cookie = "userConsent=accepted; max-age=31536000; path=/; SameSite=Lax";
    document.cookie = "analytics=enabled; max-age=31536000; path=/; SameSite=Lax";
    setShowCookieConsent(false);
  };

  const handleRejectCookies = () => {
    localStorage.setItem("cookieConsent", "rejected");
    document.cookie = "userConsent=rejected; max-age=31536000; path=/; SameSite=Lax";
    document.cookie = "analytics=disabled; max-age=31536000; path=/; SameSite=Lax";
    setShowCookieConsent(false);
  };

  const handleSubscribe = () => {
    if (!email) {
      alert("Please enter your email!");
      return;
    }
    openSignUp({ emailAddress: email });
  };

  const FooterLogo = () => (
    <div className="flex items-center gap-2 mb-6">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-xl">E</span>
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
        EdTechBd
      </span>
    </div>
  );

  return (
    <>
      {/* Cookie Consent Popup */}
      {showCookieConsent && (
        <div className="fixed bottom-2 rounded-2xl left-20 right-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-2xl z-50 animate-slide-up">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 max-w-2xl">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">🍪</span>
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1">
                      Cookie Preferences
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      We use cookies to enhance your experience and analyze site traffic.{" "}
                      <a 
                        href="#" 
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        Learn more
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row sm:flex-shrink-0 gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={handleRejectCookies}
                  className="flex-1 sm:flex-none px-5 py-2 bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium text-sm"
                >
                  Reject
                </button>
                <button
                  onClick={handleAcceptCookies}
                  className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Popup */}
      {showTermsPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Terms of Service</h2>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Welcome to EdTechBd. By accessing our platform, you agree to these terms.
              </p>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">1. Acceptance of Terms</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                By using our services, you accept and agree to be bound by these Terms of Service.
              </p>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">2. User Responsibilities</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You are responsible for maintaining the confidentiality of your account information.
              </p>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">3. Content Usage</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                All course materials and content are protected by copyright and intellectual property laws.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowTermsPopup(false)}
                className="w-full bg-blue-600 text-white font-medium rounded-lg px-6 py-3 hover:bg-blue-700 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-20 w-full">
        <div className="w-full px-6 md:px-12 lg:px-16 xl:px-24 pt-8 pd-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-1">
              <FooterLogo />
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Empowering learners worldwide with cutting-edge courses and expert instructors. Transform your career with EdTechBd.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300">
                  <FaFacebookF className="text-sm" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-all duration-300">
                  <FaTwitter className="text-sm" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300">
                  <FaLinkedinIn className="text-sm" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-300">
                  <FaInstagram className="text-sm" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6 text-white">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6 text-white">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Courses</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6 text-white">Stay Updated</h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Get the latest updates on courses, learning tips, and industry insights.
              </p>

              {!user && (
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    onClick={handleSubscribe}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg px-4 py-3 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
                  >
                    Subscribe Now
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-800 pt-2 ">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                © 2025 EdTechBd. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-gray-500">
                <button 
                  onClick={() => setShowTermsPopup(true)}
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <button 
                  onClick={() => setShowCookieConsent(true)}
                  className="hover:text-white transition-colors"
                >
                  Cookie Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
