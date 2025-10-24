// src/components/hero/HeroSection.jsx
import React from "react";
import { FaShippingFast, FaCertificate, FaGift } from "react-icons/fa";
import Button from "../button/button.jsx";
import heroBottle from "../../assets/spray.png";

const HeroSection = () => {
  return (
    <section className="relative w-full bg-[#fff3f6] overflow-x-hidden pt-28 lg:pt-36">
      {/* --- Container --- */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center min-h-[50vh] lg:min-h-[55vh] px-6 sm:px-8 lg:px-12">
        
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-[#00306b] leading-tight mb-6 lg:mb-8">
            Discover Your <span className="text-accentPink">Signature Scent</span>
          </h1>

          <p className="text-gray-700 font-montserrat text-base sm:text-lg md:text-lg lg:text-xl mb-8 lg:mb-10 max-w-[500px] lg:max-w-[550px] mx-auto lg:mx-0">
            Indulge in authentic, long-lasting perfumes curated for elegance, power, and individuality.
          </p>

          {/* Buttons */}
          <div className="flex justify-center lg:justify-start gap-4 flex-wrap mb-6 lg:mb-8">
            <Button className="bg-accentBlue text-white hover:bg-blue-600 transition-colors duration-300 text-lg px-6 sm:px-8 py-3 rounded-full">
              Shop Now
            </Button>
            <Button className="border border-accentBlue text-accentBlue hover:bg-accentBlue hover:text-white transition-colors duration-300 text-lg px-6 sm:px-8 py-3 rounded-full">
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
        <div className="flex-1 flex justify-center lg:justify-end items-center relative w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[380px] overflow-hidden mt-8 lg:mt-0">
          <img
            src={heroBottle}
            alt="Perfume Bottle"
            className="h-full w-auto max-w-full object-contain transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#fff3f6] via-transparent to-transparent opacity-60 pointer-events-none"></div>
        </div>
      </div>

      {/* Category Buttons */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center gap-4 sm:gap-6 flex-wrap max-w-7xl mx-auto w-full px-0">
        {[].map((category) => (
          <button
            key={category}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-full shadow-md text-gray-700 hover:bg-accentPink hover:text-white font-montserrat transition-all duration-300"
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
