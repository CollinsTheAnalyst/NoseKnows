// src/pages/OrderDetailsForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartcontext.jsx";
import { Phone, MapPin } from "lucide-react"; // Icons for form fields

const OrderDetailsForm = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  // Calculate Total from global cart items
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMpesaPay = async (e) => {
    e.preventDefault();

    if (!formData.phone || !totalAmount) {
      alert("Please ensure phone number is entered and cart is not empty.");
      return;
    }

    setLoading(true);
    try {
      // 1. Initiate M-Pesa Payment (using logic from old Checkout.jsx)
      const response = await axios.post(
        "http://127.0.0.1:8000/api/checkout/mpesa-pay/",
        { 
          phone: formData.phone, 
          amount: totalAmount.toFixed(2), // Send fixed float value
          order_details: { // Send cart details to backend for order creation
            items: cartItems.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price })),
            shipping_address: formData.address,
            customer_name: formData.name,
            customer_email: formData.email
          }
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(response.data);
      alert("✅ STK Push sent. Please complete payment on your phone.");
      clearCart(); // Clear cart after payment initiation
      
      // 2. Navigate to Confirmation Page
      navigate("/checkout/confirmation"); // Navigate to the Confirmation page
    } catch (error) {
      console.error("Payment Error:", error.response?.data || error.message);
      alert("❌ Payment failed. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 space-y-4 pt-32">
        <h2 className="text-2xl font-semibold">Your cart is empty!</h2>
        <button onClick={() => navigate("/shop")} className="px-6 py-2 bg-[#7B6IFF] text-white rounded-lg hover:bg-[#5e52d4] transition">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-playfair font-bold mb-6 text-center text-[#00306b]">
          Final Checkout
        </h2>

        {/* Order Summary */}
        <div className="mb-8 border-b pb-4">
          <h3 className="text-xl font-semibold mb-2">Order Total</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total ({cartItems.length} items)</span>
            <span className="text-2xl font-bold text-pink-600">Ksh {totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Customer Details Form */}
        <form onSubmit={handleMpesaPay}>
          <h3 className="text-xl font-semibold mb-4">Contact & Delivery</h3>
          <div className="space-y-4">
            
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00306b] outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00306b] outline-none"
              />
            </div>
            
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 flex items-center">
                <Phone size={16} className="mr-1" /> Phone Number (for M-Pesa)
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="2547xxxxxxxx"
                required
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00306b] outline-none"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 flex items-center">
                <MapPin size={16} className="mr-1" /> Delivery Address / City
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                required
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00306b] outline-none"
              ></textarea>
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={loading || totalAmount === 0}
            className="w-full mt-8 bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition disabled:bg-gray-400"
          >
            {loading
              ? "Initiating Payment..."
              : `Pay Ksh ${totalAmount.toFixed(2)} with M-Pesa`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderDetailsForm;