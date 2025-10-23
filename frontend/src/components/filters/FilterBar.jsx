// src/components/FilterBar.jsx
import React from "react";

const FilterBar = ({ filters }) => {
  return (
    <div className="flex space-x-4 mb-6">
      {filters.map((filter) => (
        <button
          key={filter}
          className="bg-white text-black px-4 py-2 rounded border hover:bg-gray-100"
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
