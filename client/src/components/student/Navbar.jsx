import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";
import logo from "../../assets/logof.png";

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
    useContext(AppContext);
  const location = useLocation();
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  // ✅ Become Educator handler
  const becomeEducator = async () => {
    if (!user) {
      openSignIn();
      return;
    }

    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }

      const token = await getToken();
      if (!token) {
        toast.error("User session expired. Please sign in again.");
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/educator/update-role`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
        navigate("/educator"); // Automatically navigate after success
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const Logo = () => (
    <div
      className="flex items-center gap-1 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <div className="flex items-center justify-center hover:scale-105 transition-transform duration-300 w-9 h-9">
        <img src={logo} alt="Logo" className="h-5 w-5 object-contain" />
      </div>
      <span
  className="text-2xl font-extrabold tracking-tight transition-transform duration-300 hover:scale-101"
  style={{
    fontFamily: "'Bitcount Prop Single Ink', sans-serif",
  }}
>
  {/* <span className="bg-gradient-to-r from-[#003087] to-[#009cde] text-transparent bg-clip-text drop-shadow-[0_0_8px_rgba(0,156,222,0.4)]">
    Ed
  </span>
  <span className="bg-gradient-to-r from-[#003087] to-[#009cde] text-transparent bg-clip-text drop-shadow-[0_0_8px_rgba(0,156,222,0.4)]">
    Tech
  </span>
  <span className="text-[#1877F2] drop-shadow-[0_0_6px_rgba(24,119,242,0.4)] font-extrabold tracking-tight">
  BD
</span> */}
<span className="text-black " onClick={() => navigate("/") }>EdTechBD</span>
</span>




    </div>
  );

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-xl bg-white/90 shadow-lg border-b border-gray-100">
      {/* Decorative gradient line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Search */}
          <div className="flex items-center gap-4 md:gap-6 flex-1">
            <Logo />
            <div className="hidden lg:block flex-1 max-w-md">
              <SearchBar compact />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              {["/", "/course-list", "/deals", "/blog"].map((path, idx) => {
                const label = ["Home", "All Courses", "Deals", "Blog"][idx];
                return (
                  <Link
                    key={idx}
                    to={path}
                    className={`relative px-4 py-2 rounded-lg transition-all duration-200 group ${
                      isActive(path)
                        ? "text-blue-600 font-semibold bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-sm font-medium">{label}</span>
                    {isActive(path) && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              {user && (
                <>
                  <button
                    onClick={becomeEducator}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 hover:border-yellow-300 hover:shadow-md transition-all duration-200"
                  >
                    {isEducator ? "Dashboard" : "Become Educator"}
                  </button>
                  <Link
                    to="/my-enrollments"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/my-enrollments")
                        ? "text-blue-600 bg-blue-50 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    My Courses
                  </Link>
                </>
              )}
              {!user && (
                <button
                  onClick={openSignIn}
                  className="relative px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer"></span>
                  <span className="relative">Get Started</span>
                </button>
              )}
              {user && (
                <div className="relative">
                  <div className="ring-2 ring-blue-100 rounded-full hover:ring-blue-200 transition-all duration-200">
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonBox:
                            "bg-white rounded-full shadow-md hover:scale-110 transition-transform duration-200",
                        },
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 bg-gray-700 rounded transition-all duration-300 ${showMobileMenu ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 bg-gray-700 rounded transition-all duration-300 ${showMobileMenu ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 bg-gray-700 rounded transition-all duration-300 ${showMobileMenu ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-gradient-to-br from-white to-gray-50 shadow-xl border-t border-gray-100 animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            {/* Search on mobile */}
            <div className="mb-4">
              <SearchBar compact />
            </div>
            
                    {/* Navigation Links */}
                    {["/", "/course-list", "/deals", "/blog"].map((path, idx) => {
                      const label = ["Home", "All Courses", "Deals", "Blog"][idx];
                      return (
                        <Link
                          key={idx}
                          to={path}
                          onClick={() => setShowMobileMenu(false)}
                          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive(path)
                              ? "text-blue-600 font-semibold bg-blue-50"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span className="font-medium">{label}</span>
                        </Link>
                      );
                    })}
                    
                    {user && <div className="h-px bg-gray-200 my-2"></div>}
                    
                    {/* User Actions */}
                    {user && (
                      <>
                        <button
                          onClick={() => {
                            becomeEducator();
                            setShowMobileMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 hover:border-yellow-300 transition-all duration-200"
                        >
                          <span className="font-medium">{isEducator ? "Educator Dashboard" : "Become Educator"}</span>
                        </button>
                        <Link
                          to="/my-enrollments"
                          onClick={() => setShowMobileMenu(false)}
                          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive("/my-enrollments")
                              ? "text-blue-600 font-semibold bg-blue-50"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span className="font-medium">My Courses</span>
                        </Link>
                      </>
                    )}
                    
                    {!user && (
                      <button
                        onClick={() => {
                          openSignIn();
                          setShowMobileMenu(false);
                        }}
                        className="w-full mt-2 px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                      >
                        Get Started
                      </button>
                    )}
                  </div>
                </div>
              )}
            </nav>
  );
};

export default Navbar;
