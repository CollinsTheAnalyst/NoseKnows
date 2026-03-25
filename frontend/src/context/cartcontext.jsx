// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- Cart functions ---

  const addToCart = (product) => {
    setCartItems((prev) => {
      // Logic to handle unique items based on ID + Variant
      const cartId = product.selectedVariant 
        ? `${product.id}-${product.selectedVariant.id}` 
        : product.id;

      const existingItem = prev.find((item) => item.cartId === cartId);

      if (existingItem) {
        return prev.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, cartId, quantity: 1 }];
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // ✅ Added this function for the + and - buttons
  const updateCartItemQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  // ✅ Added cartTotal calculation
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item.selectedVariant?.price || item.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // --- Wishlist functions ---
  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        isCartOpen,
        cartTotal, // ✅ Added
        addToCart,
        removeFromCart,
        updateCartItemQuantity, // ✅ Added (Used by CartPage)
        updateQuantity: updateCartItemQuantity, // ✅ Alias (Used by Checkout)
        clearCart, // ✅ Added
        toggleCart,
        setCartItems,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);