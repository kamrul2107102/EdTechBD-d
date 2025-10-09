import React from "react";
import { assets } from "../../assets/assets";

const Companies = () => {
  const logos = [
    assets.microsoft_logo,
    assets.walmart_logo,
    assets.accenture_logo,
    assets.adobe_logo,
    assets.paypal_logo,
    assets.google,
    assets.twitter,
    assets.bmw,
    assets.apple,
  ];

  // Shuffle logos for random order
  const shuffledLogos = logos
    .map((logo) => ({ logo, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ logo }) => logo);

  return (
    <div className="pt-16 w-full overflow-hidden">
      <p className="text-base text-gray-500 text-center">
        Trusted by learners from
      </p>

      <div className="relative w-full overflow-hidden mt-5">
        <div className="flex gap-16 md:gap-32 whitespace-nowrap animate-marquee">
          {shuffledLogos.concat(shuffledLogos).map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt="company"
              className="inline-block h-6 md:h-8 object-contain"
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Companies;
