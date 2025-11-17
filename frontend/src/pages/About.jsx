import React from "react";

const About = () => {
  return (
    <section className="bg-[#FFF7F2] pt-[140px] pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-20">
        
        {/* Heading */}
        <div className="space-y-6">
          <h1 className="text-6xl sm:text-7xl font-playfair font-bold text-[#042540]">
            About <span className="text-[#F9A826]">NoseKnows</span>
          </h1>
          {/* Divider */}
          <div className="mx-auto w-28 h-1 bg-[#F9A826] rounded-full"></div>
        </div>

        {/* Intro */}
        <p className="text-lg sm:text-2xl font-montserrat text-[#042540] max-w-3xl mx-auto leading-relaxed">
          At <strong className="text-[#F9A826]">NoseKnows</strong>, every fragrance tells a story. 
          Our curated collection allows you to express your <strong>personality</strong>, <strong>mood</strong>, and <strong>style</strong> effortlessly. 
          From timeless classics to modern blends, we bring the world of premium scents right to your doorstep.
        </p>

        {/* What We Offer */}
        <div className="space-y-10 max-w-3xl mx-auto text-left sm:text-center">
          <p className="text-gray-700 font-montserrat text-lg sm:text-xl leading-relaxed">
            Our mission is to make luxury fragrances <strong className="text-[#F9A826]">accessible</strong> to everyone, combining quality, elegance, and convenience in every purchase.
          </p>
          <p className="text-gray-700 font-montserrat text-lg sm:text-xl leading-relaxed">
            We strive to inspire <strong className="text-[#F9A826]">confidence</strong> and <strong className="text-[#F9A826]">sophistication</strong> through scents that leave a lasting impression, whether for daily wear or special occasions.
          </p>
          <p className="text-gray-700 font-montserrat text-lg sm:text-xl leading-relaxed">
            With <strong className="text-[#F9A826]">NoseKnows</strong>, discovering your <strong>signature fragrance</strong> has never been easier. Explore, experience, and enjoy the art of perfumery with us.
          </p>
        </div>

      </div>
    </section>
  );
};

export default About;
