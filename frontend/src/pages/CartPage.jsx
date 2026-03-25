// src/pages/CartPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, XCircle, ArrowRight } from "lucide-react"; 
import { useCart } from "../context/cartcontext.jsx"; 

const CartPage = () => {
    const { 
        cartItems, 
        removeFromCart, 
        updateCartItemQuantity, 
        clearCart,
        cartTotal // Make sure this is pulled from context
    } = useCart();
    const navigate = useNavigate();

    // Helper: Safely get price
    const getSafePrice = (item) => {
        const price = item.selectedVariant?.price || item.price || 0;
        return Number(price);
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 space-y-4 pt-32 bg-white"> 
                <div className="bg-gray-50 p-8 rounded-full">
                  <ShoppingCart size={60} className="text-gray-300" />
                </div>
                <h2 className="text-2xl font-playfair font-bold text-[#00306b]">Your cart is waiting</h2>
                <p className="text-gray-500">Add your favorite fragrances to get started.</p>
                <button
                    onClick={() => navigate("/shop")}
                    className="mt-4 px-8 py-3 bg-[#00306b] text-white rounded-full font-bold hover:shadow-lg transition-all"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24 bg-white"> 
            <div className="flex items-end justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-playfair font-bold text-[#00306b]">Shopping Cart</h1>
                    <p className="text-gray-400 mt-2">{cartItems.length} items in your bag</p>
                </div>
                
                {/* 1. APPEALING CLEAR CART BUTTON */}
                <button
                    onClick={clearCart}
                    className="flex items-center gap-2 text-gray-400 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition-colors group"
                >
                    <XCircle size={16} className="group-hover:rotate-90 transition-transform" />
                    Clear entire cart
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items */}
                <div className="lg:w-2/3 space-y-6">
                    {cartItems.map((item) => {
                        const currentPrice = getSafePrice(item);
                        // Use cartId if available, fallback to id
                        const itemKey = item.cartId || item.id;
                        
                        return (
                            <div key={itemKey} className="flex items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-24 object-contain rounded-xl bg-gray-50 p-2"
                                />

                                <div className="flex-1 ml-6">
                                    <h3 className="text-lg font-bold text-[#00306b]">{item.name}</h3>
                                    <p className="text-gray-400 text-xs uppercase font-bold tracking-tighter mb-2">
                                        {item.selectedVariant?.size || "Standard Size"}
                                    </p>
                                    <p className="text-[#00306b] font-medium">
                                        Ksh {currentPrice.toLocaleString()}
                                    </p>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                                    <button
                                        onClick={() => updateCartItemQuantity(itemKey, item.quantity - 1)}
                                        className="text-gray-400 hover:text-[#00306b] disabled:opacity-30"
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus size={14} strokeWidth={3} />
                                    </button>
                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateCartItemQuantity(itemKey, item.quantity + 1)}
                                        className="text-gray-400 hover:text-[#00306b]"
                                    >
                                        <Plus size={14} strokeWidth={3} />
                                    </button>
                                </div>

                                <div className="ml-8 text-right flex flex-col items-end gap-2">
                                    <span className="text-lg font-bold text-accentPink">
                                        Ksh {(currentPrice * item.quantity).toLocaleString()}
                                    </span>
                                    <button
                                        onClick={() => removeFromCart(itemKey)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Summary Section */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50 sticky top-32">
                        <h2 className="text-xl font-bold mb-6 text-[#00306b]">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-bold text-gray-800">Ksh {cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Shipping</span>
                                <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full uppercase tracking-widest">
                                    Calculated at Checkout
                                </span>
                            </div>
                            
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Total Amount</span>
                                    <span className="text-3xl font-bold text-accentPink">Ksh {cartTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/checkout/summary")}
                            className="w-full mt-8 bg-[#00306b] text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:bg-[#002552] transition-all flex items-center justify-center gap-3 group"
                        >
                            Proceed to Checkout
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <p className="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-widest font-bold">
                            Secure payment via M-Pesa
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;