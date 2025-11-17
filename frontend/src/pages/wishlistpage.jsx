// src/pages/WishlistPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useCart } from "../context/cartcontext.jsx";
import Card from "../components/card/card.jsx";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, addToCart, openCart } = useCart();
  const navigate = useNavigate();

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 space-y-4">
        <Heart size={50} className="text-red-400" />
        <h2 className="text-2xl font-semibold">Your Wishlist is empty</h2>
        <button
          onClick={() => navigate("/shop")}
          className="px-6 py-2 bg-[#7B6IFF] text-white rounded-lg hover:bg-[#5e52d4] transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-8 text-[#042540]">Your Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlistItems.map((item) => (
          <Card
            key={item.id}
            slug={item.slug || item.id}
            image={item.image}
            title={item.name}
            description={item.description}
            priceRange={item.selectedVariant?.price}
            quantity={item.selectedVariant?.quantity || 1}
            outOfStock={item.selectedVariant?.quantity === 0}
            onCartClick={() => {
              addToCart({
                ...item,
                selectedVariant: item.selectedVariant,
                quantity: 1,
              });
              openCart();
            }}
            onWishlistClick={() => removeFromWishlist(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
