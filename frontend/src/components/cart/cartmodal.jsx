// src/components/cart/CartModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCart } from "../../context/cartcontext.jsx";

const CartModal = ({ show, onClose }) => {
  const { cartItems, removeFromCart, getTotal } = useCart();

  const handleCheckout = () => {
    alert("Proceed with your cart items inside this modal or implement in-place checkout.");
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-80 sm:w-96 p-6 text-left z-[10000] flex flex-col max-h-[80vh]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-[#00306b] mb-4">
              Your Cart 🛒
            </h2>

            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="flex-1 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between mb-4 border-b pb-2"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 ml-3">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        className="text-red-500 text-sm mt-1"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cartItems.length > 0 && (
              <div className="mt-auto pt-4 border-t flex flex-col gap-3">
                <p className="text-lg font-semibold">
                  Total: ${getTotal().toFixed(2)}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={handleCheckout}
                    className="bg-[#00306b] text-white px-4 py-2 rounded-lg hover:bg-[#00408a] transition flex-1 mr-2"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={onClose}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition flex-1 ml-2"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
