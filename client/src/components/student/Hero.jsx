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
        }, 100); // typing speed
      } else {
        // wait before erasing
        timeout = setTimeout(() => setTyping(false), 1500);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
          setCharIndex(charIndex - 1);
        }, 50); // erasing speed
      } else {
        setTyping(true);
        setCurrentPhrase((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, typing, currentPhrase, phrases]);

  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70">
      <h1 className="md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto">
        Empower your future with courses designed to{" "}
        <span className="text-blue-600">fit your choice.</span>
        <img
          src={assets.sketch}
          alt="sketch"
          className="md:block hidden absolute -bottom-7 right-0"
        />
      </h1>

   {/* Typing effect */}
<p className="text-blue-600 font-semibold max-w-2xl mx-auto md:block hidden text-2xl md:text-4xl min-h-[7rem] pb-4">
  {displayedText}
  <span className="border-r-2 border-blue-600 animate-pulse ml-1"></span>
</p>

{/* Mobile version */}
<p className="text-blue-600 font-semibold max-w-sm mx-auto md:hidden text-xl min-h-[3rem] pb-3">
  {displayedText}
  <span className="border-r-2 border-blue-600 animate-pulse ml-1"></span>
</p>


      <SearchBar tall />
    </div>
  );
};

export default Hero;
