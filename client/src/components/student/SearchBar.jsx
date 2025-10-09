import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data, compact, tall }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    navigate("/course-list/" + input.trim());
  };

  // Conditional classes
  const heightClass = tall ? "h-16 md:h-16" : compact ? "h-10" : "h-14 md:h-14";
  const textClass = compact
    ? "text-sm"
    : tall
    ? "text-base md:text-lg"
    : "text-sm md:text-base";
  const iconSize = compact ? "w-4 h-5" : tall ? "w-6 h-6" : "w-6 h-6";
  const buttonPadding = compact ? "px-3" : tall ? "px-7 md:px-6" : "px-6 md:px-6";
  const widthClass = tall ? "w-[75vw] md:w-[60vw]" : compact ? "w-80 md:w-96" : "w-full";

  return (
    <form
      onSubmit={onSearchHandler}
      className={`flex items-center bg-white border border-gray-300 rounded-full shadow-sm overflow-hidden ${heightClass} ${widthClass}`}
    >
      {/* Search Icon */}
      <div
        className={`flex items-center justify-center px-3 border-r border-gray-300 ${heightClass}`}
      >
        <img
          src={assets.search_icon}
          alt="search_icon"
          className={`${iconSize} object-contain`}
        />
      </div>

      {/* Input Field */}
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="Search Courses..."
        className={`flex-1 px-2 text-gray-600 placeholder-gray-400 focus:outline-none ${textClass} ${heightClass}`}
      />

      {/* Conditionally render button only if not compact */}
      {!compact && (
        <button
          type="submit"
          className={`bg-blue-600 hover:bg-blue-700 transition text-white rounded-r-full font-medium ${buttonPadding} ${textClass} ${heightClass}`}
        >
          Search
        </button>
      )}
    </form>
  );
};

export default SearchBar;
