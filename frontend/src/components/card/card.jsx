// src/components/card/Card.jsx
import React from "react";
import { FaWhatsapp, FaHeart, FaShoppingCart } from "react-icons/fa";

const Card = ({
  image,
  title,
  description,
  quantity,
  price,
  priceRange,
  sale,
  outOfStock,
  onWhatsAppClick,
  onWishlistClick,
  onCartClick
}) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-102 hover:shadow-xl transition-all duration-100 group flex flex-col">
      
      {/* Sale / Out-of-stock Badge */}
      {sale && (
        <span className="absolute top-3 left-3 bg-accentPink text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
          {sale}
        </span>
      )}
      {outOfStock && (
        <span className="absolute top-3 left-3 bg-gray-400 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
          Out of Stock
        </span>
      )}

      {/* Product Image */}
      <div className="w-full h-64 sm:h-72 md:h-80 overflow-hidden relative flex justify-center">
        <img
          src={image}
          alt={title}
          className="max-w-full max-h-full object-contain transition-transform duration-200 group-hover:scale-103"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-100"></div>
      </div>


      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#00306b]">{title}</h3>
          {description && <p className="text-gray-500 text-sm sm:text-base mt-4">{description}</p>}
          {quantity && <p className="text-gray-600 text-sm mt-4">Available: {quantity}</p>}
          {priceRange && <p className="text-grey-300 font-semibold text-sm sm:text-base mt-4">Ksh: {priceRange}</p>}
        </div>

        {/* Action Buttons */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        {/* WhatsApp Button */}
        <button
          onClick={onWhatsAppClick}
          className="flex-none bg-gray-100 text-green-600 border-2 border-green-500 px-3 py-2 rounded-md flex items-center justify-center text-sm sm:text-base hover:bg-green-50 transition"
        >
          <FaWhatsapp className="mr-2" />
        </button>

        {/* Wishlist Button */}
        <button
          onClick={onWishlistClick}
          className="flex-none bg-gray-100 text-red-600 border-2 border-red-500 px-3 py-2 rounded-md flex items-center justify-center hover:bg-red-50 transition"
        >
          <FaHeart />
        </button>


        {/* Add to Cart Button */}
        <button
          onClick={outOfStock ? null : onCartClick}
          className={`flex-1 sm:flex-none min-w-[40px] sm:min-w-[120px] px-2 sm:px-4 py-2 sm:py-2.5 rounded-md flex items-center justify-center text-[#00306b] font-normal text-sm sm:text-base transition mx-1
          ${outOfStock ? "bg-gray-300 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          <FaShoppingCart className="mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{outOfStock ? "Out of Stock" : "Cart"}</span>
        </button>


      </div>
      </div>
    </div>
  );
};

export default Card;
