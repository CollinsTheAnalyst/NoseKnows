import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartcontext.jsx";
import { Phone, MapPin, User, Mail, StickyNote, CreditCard, Wallet, ChevronRight, ShieldCheck } from "lucide-react";

const OrderDetailsForm = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  // Calculation
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (Number(item.selectedVariant?.price || item.price) * item.quantity),
    0
  );

  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "254", // Default prefix for Kenya
    address: "",
    deliveryNote: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (paymentMethod === "mpesa" && (!formData.phone || formData.phone.length < 12)) {
      alert("Please enter a valid M-Pesa phone number (2547...)");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        payment_method: paymentMethod,
        amount: totalAmount.toFixed(2),
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.selectedVariant?.price || item.price,
          size: item.selectedVariant?.size
        }))
      };

      // If M-Pesa is selected, we hit the STK push endpoint
      const endpoint = paymentMethod === "mpesa" 
        ? "http://127.0.0.1:8000/api/checkout/mpesa-pay/" 
        : "http://127.0.0.1:8000/api/checkout/create-order/";

      await axios.post(endpoint, payload);
      
      if (paymentMethod === "mpesa") {
        alert("✅ STK Push sent. Enter your M-Pesa PIN on your phone.");
      } else {
        alert("✅ Order placed successfully!");
      }

      clearCart();
      navigate("/checkout/confirmation");
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("❌ Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 pt-32">
        <h2 className="text-2xl font-bold">Your cart is empty!</h2>
        <button onClick={() => navigate("/shop")} className="mt-4 px-8 py-3 bg-[#00306b] text-white rounded-full">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-40 pb-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* LEFT COLUMN: Delivery & Payment Details */}
        <div className="flex-[1.8] space-y-8">
          <form id="order-form" onSubmit={handlePlaceOrder}>
            
            {/* Shipping Section */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
              <h2 className="text-2xl font-playfair font-bold text-[#00306b] mb-8 flex items-center gap-3">
                <MapPin size={24} className="text-pink-500" /> Delivery Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-300" size={18} />
                    <input name="name" required onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 border-transparent transition-all" placeholder="Collins Nose" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-gray-300" size={18} />
                    <input type="email" name="email" required onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl outline-none" placeholder="collins@example.com" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">Delivery Address / Apartment</label>
                  <input name="address" required onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100" placeholder="e.g. Imenti House, Suite 4, Nairobi" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
                    <StickyNote size={14} /> Delivery Note (Optional)
                  </label>
                  <textarea name="deliveryNote" onChange={handleChange} rows="2" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none resize-none" placeholder="e.g. Leave it at the front desk..." />
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-playfair font-bold text-[#00306b] mb-8">Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                
                {/* M-Pesa Option */}
                <div 
                  onClick={() => setPaymentMethod("mpesa")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${paymentMethod === 'mpesa' ? 'border-[#00306b] bg-blue-50' : 'border-gray-100 bg-white hover:border-blue-100'}`}
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-black text-xs">M</div>
                  <span className={`text-sm font-bold ${paymentMethod === 'mpesa' ? 'text-[#00306b]' : 'text-gray-500'}`}>M-Pesa</span>
                </div>

                {/* COD Option */}
                <div 
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${paymentMethod === 'cod' ? 'border-[#00306b] bg-blue-50' : 'border-gray-100 bg-white hover:border-blue-100'}`}
                >
                  <Wallet size={32} className={paymentMethod === 'cod' ? 'text-[#00306b]' : 'text-gray-400'} />
                  <span className="text-sm font-bold">Pay on Delivery</span>
                </div>

                {/* Card Option (Disabled for now) */}
                <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 opacity-40 flex flex-col items-center gap-3 cursor-not-allowed">
                  <CreditCard size={32} className="text-gray-400" />
                  <span className="text-sm font-bold">Credit Card</span>
                </div>
              </div>

              {paymentMethod === "mpesa" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-xs font-bold uppercase text-pink-500">M-Pesa Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 text-pink-400" size={18} />
                    <input name="phone" required value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-pink-50 rounded-xl outline-none border border-pink-100 text-[#00306b] font-bold" placeholder="254712345678" />
                  </div>
                </div>
              )}
            </section>
          </form>
        </div>

        {/* RIGHT COLUMN: Sticky Order Summary */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-50 sticky top-32">
            <h3 className="text-xl font-bold text-[#00306b] mb-6 border-b pb-4">Order Summary</h3>
            
            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.cartId} className="flex gap-4 items-center">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-gray-50 rounded-xl" />
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-800 truncate">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">{item.selectedVariant?.size}</p>
                  </div>
                  <p className="font-bold text-[#00306b] text-sm">Ksh {(Number(item.selectedVariant?.price || item.price) * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Subtotal</span>
                <span>Ksh {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Shipping</span>
                <span className="text-green-500 font-bold uppercase text-[10px]">Free Delivery</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-gray-800 font-bold">Total</span>
                <span className="text-2xl font-bold text-pink-600">Ksh {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button
              form="order-form"
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-[#00306b] text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:bg-gray-200"
            >
              {loading ? "Processing..." : paymentMethod === 'mpesa' ? "Pay Now" : "Complete Purchase"}
              <ChevronRight size={20} />
            </button>
            
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <ShieldCheck size={14} className="text-green-500" /> 100% Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsForm;