// src/components/card/Card.jsx
import React from "react";
import Button from "../button/button.jsx";

const Card = ({ image, title, description, price, onButtonClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
      {/* Product Image */}
      <div className="w-full h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-lg md:text-xl font-semibold mb-2 text-textDark">{title}</h3>
        <p className="text-gray-500 mb-4 text-sm md:text-base">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-accentPink font-bold text-lg">${price}</span>
          <Button
            className="bg-accentBlue text-white hover:bg-blue-600 px-4 py-2 text-sm md:text-base"
            onClick={onButtonClick}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Card;
