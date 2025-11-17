// src/pages/CartPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, XCircle } from "lucide-react"; 
import { useCart } from "../context/cartcontext.jsx"; 

const CartPage = () => {
    const { 
        cartItems, 
        removeFromCart, 
        updateCartItemQuantity, 
        clearCart 
    } = useCart();
    const navigate = useNavigate();

    // Calculate Subtotal
    const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
    );

    // Empty Cart State
    if (cartItems.length === 0) {
        return (
            // Adjusted pt-30 to a standard Tailwind class for clearance
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 space-y-4 pt-32"> 
                <ShoppingCart size={50} className="text-gray-400" />
                <h2 className="text-2xl font-semibold">Your Shopping Cart is empty</h2>
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
        // ✅ FIX: Increased top padding to pt-32 to fully clear the tall fixed TopNav
        <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12"> 
            <h1 className="text-4xl font-playfair font-bold mb-10 text-[#042540]">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items List (Left Column) */}
                <div className="lg:w-2/3 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center bg-white p-4 rounded-xl shadow-md border border-gray-100">
                            {/* Product Image */}
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-contain rounded-lg mr-4 border"
                            />

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-[#042540] truncate">{item.name}</h3>
                                <p className="text-gray-500 text-sm">
                                    Ksh {item.price.toFixed(2)}
                                </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center mx-4 border rounded-lg overflow-hidden">
                                <button
                                    onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="px-3 text-sm font-medium">{item.quantity}</span>
                                <button
                                    onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                    className="p-2 text-gray-600 hover:bg-gray-100"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            {/* Total Price & Remove Button */}
                            <div className="flex flex-col items-end">
                                <span className="text-lg font-bold text-pink-600">
                                    Ksh {(item.price * item.quantity).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-gray-400 hover:text-red-500 mt-1 transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {/* Clear Cart Button */}
                    <button
                        onClick={clearCart}
                        className="flex items-center justify-center text-red-700 bg-red-100 px-4 py-2 rounded-lg hover:bg-red-200 mt-6 text-sm font-semibold transition"
                    >
                        <XCircle size={18} className="mr-2" />
                        Clear entire cart
                    </button>
                </div>

                {/* Order Summary (Right Column) */}
                <div className="lg:w-1/3 bg-white p-6 rounded-xl shadow-lg h-fit border border-gray-100">
                    <h2 className="text-2xl font-semibold mb-4 text-[#042540]">Order Summary</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                            <span className="font-medium">Ksh {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping Estimate</span>
                            <span className="font-medium">Calculated at Checkout</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-gray-200">
                            <span className="text-xl font-bold text-[#042540]">Total</span>
                            <span className="text-xl font-bold text-pink-600">Ksh {subtotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                        onClick={() => navigate("/checkout/summary")}
                        className="w-full mt-6 bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 font-semibold transition-colors duration-300"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;