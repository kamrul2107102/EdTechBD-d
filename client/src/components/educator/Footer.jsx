import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Footer = () => {
  const { currentTheme } = useContext(AppContext);

  return (
    <footer className={`${currentTheme.bg} flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t ${currentTheme.border}`}>
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="hidden md:block h-7 w-px bg-gray-500/60"></div>
        <p className={`py-2 text-center text-xs md:text-sm ${currentTheme.text}`}>
          Copyright 2025 © K.I. All Rights Reserved.
        </p>
      </div>

      {/* Social Icons */}
      <div className="flex items-center gap-3 max-md:mt-4">
        <a href="#">
          <img src={assets.facebook_icon} alt="facebook_icon" className="invert dark:invert-0" />
        </a>
        <a href="#">
          <img src={assets.twitter_icon} alt="twitter_icon" className="invert dark:invert-0" />
        </a>
        <a href="#">
          <img src={assets.instagram_icon} alt="instagram_icon" className="invert dark:invert-0" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
