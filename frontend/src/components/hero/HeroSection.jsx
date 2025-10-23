// src/components/HeroSection.jsx
import React from "react";
import Button from "./button.jsx";

const HeroSection = () => {
  return (
    <section className="relative bg-hero-pattern bg-cover bg-center text-center py-32">
      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-white font-playfair text-5xl md:text-6xl font-bold mb-6">
          Discover Your Signature Scent{" "}
          <span className="text-accentPink">Today</span>
        </h1>
        <p className="text-white/90 font-montserrat text-lg md:text-xl mb-8">
          Explore our luxurious perfume collection designed for every mood and moment.
        </p>
        <Button className="bg-accentBlue text-white hover:bg-blue-600 transition-colors duration-300 text-lg px-8 py-4">
          Shop Collection
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
