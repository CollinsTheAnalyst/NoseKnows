// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]); // ✅ Add wishlist state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart functions
  const addToCart = (product) => {
    const normalizedProduct = {
      id: product.id,
      name: product.name || product.title,
      image: product.image || product.img,
      price: product.price,
      quantity: 1,
      ...product,
    };

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === normalizedProduct.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === normalizedProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, normalizedProduct];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getTotal = () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Wishlist functions
  const addToWishlist = (product) => {
    const normalizedProduct = {
      id: product.id,
      name: product.name || product.title,
      image: product.image || product.img,
      price: product.price,
      quantity: 1,
      slug: product.slug,
      ...product,
    };
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item.id === normalizedProduct.id);
      if (exists) return prev; // avoid duplicates
      return [...prev, normalizedProduct];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems, // ✅ expose wishlist
        addToCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        getTotal,
        isCartOpen,
        toggleCart,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
