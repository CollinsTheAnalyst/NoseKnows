import React from "react";

const HeroFilter = () => {
  const filters = ["Ladies", "Men", "Unisex", "Kids"]; // only 3 buttons

  return (
    <div className="w-full bg-[#fff3f6] py-20 -mt-10"> {/* taller & closer to hero */}
      <div className="max-w-7xl mx-auto px-10 sm:px-8 lg:px-8 flex justify-center lg:justify-start gap-10 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter}
            className="px-10 py-4 bg-pink-400 text-white rounded-full shadow-md font-montserrat font-bold text-lg flex-1 sm:flex-auto text-center hover:bg-pink-600 transition-all duration-300"



          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroFilter;
