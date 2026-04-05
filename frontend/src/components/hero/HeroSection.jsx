// src/components/hero/HeroSection.jsx
import React from "react";
import { FaShippingFast, FaCertificate, FaGift } from "react-icons/fa";
import Button from "../button/button.jsx";
import heroBottle from "../../assets/Noseknowshero.png";
import noseknowsLogo from "../../assets/Noseknows_logo.png";

const HeroSection = () => {
  // Define the navigation handlers
  const handleShopNowClick = () => {
    window.location.href = "/shop";
  };

  const handleExploreBrandsClick = () => {
    window.location.href = "/brands";
  };

  return (
    <section className="relative w-full bg-[#fff3f6] pt-28 lg:pt-36 overflow-hidden">
      {/* --- Main Wrapper --- 
          Removed 'max-w-7xl' and 'mx-auto' to allow full width.
          Using large horizontal padding (px) to keep content safe on ultra-wide screens.
      */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-between min-h-[65vh] lg:min-h-[75vh] px-6 md:px-12 lg:px-20 xl:px-32">
        
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center text-center lg:text-left z-10 py-10 lg:py-0">
          {/* Logo Integration */}
          <div className="mb-6 lg:mb-8 mx-auto lg:mx-0">
            <img 
              src={noseknowsLogo} 
              alt="NoseKnows - The Art of Scent" 
              className="w-48 sm:w-56 md:w-64 h-auto"
            />
          </div>

          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#00306b] leading-tight mb-6">
            Discover Your <span className="text-accentPink">Signature Scent</span>
          </h1>

          <p className="text-gray-700 font-montserrat text-base sm:text-lg lg:text-xl mb-8 lg:mb-10 max-w-[550px] mx-auto lg:mx-0">
            Indulge in authentic, long-lasting perfumes curated for elegance, power, and individuality.
          </p>

          {/* Buttons */}
          <div className="flex justify-center lg:justify-start gap-4 flex-wrap mb-10">
            <Button
              className="bg-accentBlue text-white hover:bg-blue-400 transition-all duration-300 text-lg px-10 py-3 rounded-full shadow-lg"
              onClick={handleShopNowClick}
            >
              Shop Now
            </Button>
            <Button
              className="bg-accentBlue border-2 border-accentBlue text-white hover:bg-accentBlue hover:text-white transition-all duration-300 text-lg px-10 py-3 rounded-full shadow-lg"
              onClick={handleExploreBrandsClick}
            >
              Explore Brands
            </Button>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-gray-800 opacity-90">
            <div className="flex items-center gap-2">
              <FaShippingFast className="text-accentPink text-xl" />
              <span className="font-montserrat font-medium text-sm sm:text-base">Free Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCertificate className="text-accentPink text-xl" />
              <span className="font-montserrat font-medium text-sm sm:text-base">100% Authentic</span>
            </div>
            <div className="flex items-center gap-2">
              <FaGift className="text-accentPink text-xl" />
              <span className="font-montserrat font-medium text-sm sm:text-base">Exclusive Offers</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center lg:justify-end items-end relative w-full h-[400px] lg:h-[650px] mt-10 lg:mt-0">
          <img
            src={heroBottle}
            alt="Signature Perfume Bottle"
            className="h-full w-auto max-w-full object-contain transition-transform duration-700 hover:scale-105 origin-bottom"
          />
          {/* Subtle gradient to blend the image base if necessary */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#fff3f6] via-transparent to-transparent opacity-20 pointer-events-none lg:hidden"></div>
        </div>
      </div>

      {/* Background Decorative Element (Optional - for extra flair) */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-pink-100/30 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;