// src/components/card/Card.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa"; // FaWhatsapp is no longer needed
import { useCart } from "../../context/cartcontext.jsx";

const Card = ({
  slug,
  image,
  title,
  description,
  quantity,
  priceRange,
  sale,
  outOfStock,
  // ❌ Removed: onWhatsAppClick
}) => {
  const {
    addToCart,
    openCart,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
  } = useCart();

  // Check if the product is already in wishlist
  const isInWishlist = wishlistItems.some((item) => item.id === slug);

  // Add to cart function
  const handleAddToCart = () => {
    if (outOfStock) return;

    // Assuming priceRange is a string like "Ksh: 1200.00" or "Ksh: 800.00 - 1200.00"
    // We parse the first number found as a representative price
    const priceMatch = priceRange?.toString().match(/[0-9.]+/);
    const price = priceMatch ? parseFloat(priceMatch[0]) : 0;

    addToCart({
      id: slug,
      name: title,
      price,
      image,
      quantity: 1,
    });

    openCart();
  };

  // Toggle wishlist
  const handleWishlistToggle = () => {
    const priceMatch = priceRange?.toString().match(/[0-9.]+/);
    const price = priceMatch ? parseFloat(priceMatch[0]) : 0;

    if (isInWishlist) {
      removeFromWishlist(slug);
    } else {
      addToWishlist({
        id: slug,
        name: title,
        image,
        price,
        quantity: 1,
      });
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-[1.02] hover:shadow-xl transition-all duration-200 group flex flex-col">
      {/* Sale / Out-of-stock Badge */}
      {sale && (
        <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
          {sale}
        </span>
      )}
      {outOfStock && (
        <span className="absolute top-3 left-3 bg-gray-400 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
          Out of Stock
        </span>
      )}

      {/* Product Image */}
      <Link
        to={`/product/${slug}`}
        className="w-full h-64 sm:h-72 md:h-80 flex justify-center items-center relative overflow-hidden"
      >
        <img
          src={image}
          alt={title}
          className="max-w-full max-h-full object-contain transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#00306b]">{title}</h3>
          {description && (
            <p className="text-gray-500 text-sm sm:text-base mt-2 line-clamp-2">{description}</p>
          )}
          {quantity && (
            <p className="text-gray-600 text-sm mt-2">Available: {quantity}</p>
          )}
          {priceRange && (
            <p className="text-gray-800 font-semibold text-sm sm:text-base mt-2">
              Ksh: {priceRange}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          {/* ❌ Removed WhatsApp Button */}

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlistToggle();
            }}
            // Adjusted classes to make Wishlist button occupy a standard portion of the space since WhatsApp is removed
            className={`flex-none w-1/2 sm:w-auto border-2 px-3 py-2 rounded-md flex items-center justify-center text-sm sm:text-base transition ${
              isInWishlist
                ? "bg-red-100 text-red-600 border-red-500"
                : "bg-gray-100 text-red-600 border-red-500 hover:bg-red-50"
            }`}
          >
            <FaHeart />
          </button>

          {/* Cart */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            // Adjusted classes to make Cart button occupy the rest of the space
            className={`flex-1 min-w-[40px] px-3 py-2 sm:py-2.5 rounded-md flex items-center justify-center text-[#00306b] font-medium text-sm sm:text-base transition ${
              outOfStock ? "bg-gray-300 cursor-not-allowed" : "bg-gray-300 hover:bg-purple-600"
            }`}
          >
            <FaShoppingCart className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">
              {outOfStock ? "Out of Stock" : "Cart"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;