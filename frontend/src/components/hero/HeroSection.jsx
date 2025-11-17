// src/components/hero/HeroSection.jsx
import React from "react";
import { FaShippingFast, FaCertificate, FaGift } from "react-icons/fa";
import Button from "../button/button.jsx";
import heroBottle from "../../assets/spray.png";
import noseknowsLogo from "../../assets/Noseknows Logo (3).png";

const HeroSection = () => {
  // Define the navigation handlers
  const handleShopNowClick = () => {
    window.location.href = "/shop"; // Replace with your actual shop page URL
  };

  const handleExploreBrandsClick = () => {
    window.location.href = "/brands"; // Replace with your actual brands page URL
  };

  return (
    <section className="relative w-full bg-[#fff3f6] overflow-x-hidden pt-28 lg:pt-36">
      {/* --- Container --- */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center min-h-[63vh] lg:min-h-[72vh] px-6 sm:px-8 lg:px-12">
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
          {/* Logo Integration */}
          <div className="mb-6 lg:mb-8 mx-auto lg:mx-0">
            <img 
              src={noseknowsLogo} 
              alt="NoseKnows - The Art of Scent" 
              className="w-48 sm:w-56 md:w-64 h-auto"
            />
          </div>

          <h1 className="font-playfair text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-[#00306b] leading-tight mb-6 lg:mb-8">
            Discover Your <span className="text-accentPink">Signature Scent</span>
          </h1>

          <p className="text-gray-700 font-montserrat text-base sm:text-lg md:text-lg lg:text-xl mb-8 lg:mb-10 max-w-[500px] lg:max-w-[550px] mx-auto lg:mx-0">
            Indulge in authentic, long-lasting perfumes curated for elegance, power, and individuality.
          </p>

          {/* Buttons - Now with onClick handlers */}
          <div className="flex justify-center lg:justify-start gap-4 flex-wrap mb-6 lg:mb-8">
            <Button
              className="bg-accentBlue text-white hover:bg-blue-400 transition-colors duration-400 text-lg px-6 sm:px-8 py-3 rounded-full"
              onClick={handleShopNowClick} // Added onClick handler
            >
              Shop Now
            </Button>
            <Button
              className="bg-accentBlue text-white hover:bg-blue-400 transition-colors duration-400 text-lg px-6 sm:px-8 py-3 rounded-full"
              onClick={handleExploreBrandsClick} // Added onClick handler
            >
              Explore Brands
            </Button>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-gray-800">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaShippingFast className="text-accentPink text-xl sm:text-2xl" />
              <span className="font-montserrat text-sm sm:text-base">Free Delivery</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <FaCertificate className="text-accentPink text-xl sm:text-2xl" />
              <span className="font-montserrat text-sm sm:text-base">100% Authentic</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <FaGift className="text-accentPink text-xl sm:text-2xl" />
              <span className="font-montserrat text-sm sm:text-base">Exclusive Offers</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center lg:justify-end items-center relative w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[420px] overflow-hidden mt-8 lg:mt-0">
          <img
            src={heroBottle}
            alt="Woman with flowers" // Changed alt text for better accuracy
            className="h-full w-auto max-w-full object-contain transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#fff3f6] via-transparent to-transparent opacity-60 pointer-events-none"></div>
        </div>
      </div>

      {/* Category Buttons */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center gap-4 sm:gap-6 flex-wrap max-w-7xl mx-auto w-full px-0">
        {/* Empty map for categories - as per original */}
      </div>
    </section>
  );
};

export default HeroSection;