import React, { useContext } from "react";
import { assets, dummyEducatorData } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, GraduationCap } from "lucide-react";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const educatorData = dummyEducatorData;
  const { user } = useUser();
  const { darkMode, setDarkMode, currentTheme } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div
      className={`${currentTheme.bg} flex items-center justify-between px-4 md:px-8 py-3 border-b-[3px] border-b-gradient-to-r from-blue-400 to-blue-600`}
    >
      {/* Logo */}
      <Link to="/">
        <div className="flex items-center justify-center rounded-full shadow-md hover:scale-105 transition-transform duration-300 w-10 h-10">
          <img
            src="/src/assets/logof3.svg"
            alt="Logo"
            className={`h-6 w-6 object-contain ${
              darkMode ? "invert-0" : "invert"
            }`}
          />
        </div>
      </Link>

      {/* User Section + Theme Toggle */}
      <div
        className={`flex items-center gap-4 md:gap-6 ${currentTheme.text} relative`}
      >
        {/* Greeting */}
        <p className="hidden md:block text-sm font-medium">
          Hi, {user ? user.fullName : "Developers"}
        </p>

        {/* Enter Student Mode Button */}
        <button
          onClick={() => navigate("/course-list")}
          className={`${currentTheme.buttonBg} ${currentTheme.buttonText} flex items-center gap-2 px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300 shadow-sm`}
        >
          <GraduationCap className="w-5 h-5" />
          <span className="hidden md:inline text-sm font-medium">
            Enter Student Mode
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`${currentTheme.buttonBg} ${currentTheme.buttonText} flex items-center justify-center w-10 h-10 rounded-full hover:scale-105 transition-all duration-300`}
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Profile */}
        {user ? (
          <UserButton
            appearance={{
              elements: { userButtonAvatarBox: "w-10 h-10 rounded-full" },
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 shadow-sm">
            <img
              src={assets.profile_img}
              alt="profile_img"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
