import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartcontext.jsx";
import { 
  CreditCard, Truck, ShieldCheck, MapPin, 
  User, Mail, Phone, Smartphone, Lock, Wallet 
} from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal } = useCart();

  // 1. Updated State to support 3 options
  const [paymentMethod, setPaymentMethod] = useState("mpesa");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "Nairobi",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0 && !loading) {
      navigate("/shop");
    }
  }, [cartItems, navigate, loading]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        let endpoint = "";
        let payload = { ...formData, amount: cartTotal, items: cartItems, paymentMethod };

        if (paymentMethod === "mpesa") {
            if (!formData.phone.startsWith("254") || formData.phone.length !== 12) {
                alert("Format: 2547XXXXXXXX");
                setLoading(false);
                return;
            }
            endpoint = "http://127.0.0.1:8000/api/checkout/mpesa-pay/";
        } else if (paymentMethod === "card") {
            endpoint = "http://127.0.0.1:8000/api/checkout/card-pay/";
        } else {
            // Pay on Delivery Endpoint
            endpoint = "http://127.0.0.1:8000/api/checkout/cod-pay/";
        }

        const response = await axios.post(endpoint, payload);
        
        if (paymentMethod === "mpesa") {
            alert("✅ STK Push sent! Enter PIN on your phone.");
            navigate(`/checkout/confirmation?id=${response.data.checkout_id}`);
        } else if (paymentMethod === "cod") {
            alert("✅ Order Placed! You will pay on delivery.");
            navigate("/checkout/confirmation");
        } else {
            alert("✅ Card Payment Processed Successfully!");
            navigate("/checkout/confirmation");
        }

    } catch (error) {
        alert("❌ Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-[140px] pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        <div className="flex-[1.8] space-y-8">
          {/* Section 1: Delivery Info */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-playfair font-bold text-[#00306b] mb-8 flex items-center gap-3">
              <Truck size={24} className="text-accentPink" /> Delivery Information
            </h2>
            
            <form id="checkout-form" onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-300" size={18} />
                  <input name="firstName" required onChange={handleInputChange} className="w-full pl-10 pr-4 py-3.5 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 border-none" placeholder="Collins" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Last Name</label>
                <input name="lastName" required onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gray-50 rounded-xl outline-none border-none" placeholder="Nose" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-300" size={18} />
                  <input type="email" name="email" required onChange={handleInputChange} className="w-full pl-10 pr-4 py-3.5 bg-gray-50 rounded-xl outline-none border-none" placeholder="collins@example.com" />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Delivery Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-gray-300" size={18} />
                  <input name="address" required onChange={handleInputChange} className="w-full pl-10 pr-4 py-3.5 bg-gray-50 rounded-xl outline-none border-none" placeholder="Imenti House, Room 4" />
                </div>
              </div>
            </form>
          </section>

          {/* Section 2: Payment Method (3 Options) */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-playfair font-bold text-[#00306b] mb-8">Choose Payment Method</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* M-Pesa */}
              <button 
                type="button"
                onClick={() => setPaymentMethod("mpesa")}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                  paymentMethod === "mpesa" ? "border-[#00306b] bg-blue-50/50 scale-[1.02]" : "border-gray-100 grayscale opacity-60 hover:opacity-100"
                }`}
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-black">M</div>
                <span className="font-bold text-sm text-[#00306b]">M-Pesa</span>
              </button>

              {/* Card */}
              <button 
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                  paymentMethod === "card" ? "border-[#00306b] bg-blue-50/50 scale-[1.02]" : "border-gray-100 grayscale opacity-60 hover:opacity-100"
                }`}
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <CreditCard size={20} />
                </div>
                <span className="font-bold text-sm text-[#00306b]">Credit Card</span>
              </button>

              {/* Pay on Delivery */}
              <button 
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                  paymentMethod === "cod" ? "border-[#00306b] bg-blue-50/50 scale-[1.02]" : "border-gray-100 grayscale opacity-60 hover:opacity-100"
                }`}
              >
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-white">
                  <Wallet size={20} />
                </div>
                <span className="font-bold text-sm text-[#00306b]">Delivery</span>
              </button>
            </div>

            {/* Conditional Sub-forms */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
              {paymentMethod === "mpesa" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <Smartphone size={18} />
                    <span className="text-sm font-bold uppercase tracking-wide">M-Pesa Number</span>
                  </div>
                  <input 
                    name="phone" required form="checkout-form"
                    onChange={handleInputChange} 
                    className="w-full px-6 py-4 bg-white rounded-xl border border-gray-200 text-[#00306b] font-black text-xl tracking-widest focus:ring-2 focus:ring-green-100" 
                    placeholder="254712345678" 
                  />
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Lock size={16} />
                    <span className="text-sm font-bold uppercase tracking-wide">Secure Card Payment</span>
                  </div>
                  <input 
                    name="cardNumber" onChange={handleInputChange} 
                    className="w-full px-4 py-3.5 bg-white rounded-xl border border-gray-200 font-mono tracking-widest" 
                    placeholder="0000 0000 0000 0000" 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="expiry" onChange={handleInputChange} className="px-4 py-3.5 bg-white rounded-xl border border-gray-200" placeholder="MM / YY" />
                    <input name="cvc" onChange={handleInputChange} className="px-4 py-3.5 bg-white rounded-xl border border-gray-200" placeholder="CVC" />
                  </div>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="text-center py-4">
                  <ShieldCheck size={40} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium">You will pay for your order in cash or via M-Pesa once it reaches your doorstep.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-50 sticky top-[140px]">
            <h3 className="text-xl font-bold text-[#00306b] mb-6">Your Order</h3>
            
            <div className="max-h-[300px] overflow-y-auto space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.cartId} className="flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-gray-50 rounded-xl" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">{item.selectedVariant?.size} x {item.quantity}</p>
                  </div>
                  <p className="font-bold text-[#00306b] text-sm">Ksh {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-50">
              <div className="flex justify-between items-end pt-4">
                <span className="text-gray-800 font-bold">Total</span>
                <span className="text-2xl font-bold text-accentPink">Ksh {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              form="checkout-form"
              type="submit"
              disabled={loading}
              className={`w-full mt-8 text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 ${
                paymentMethod === 'mpesa' ? 'bg-[#10b981]' : 
                paymentMethod === 'card' ? 'bg-[#00306b]' : 'bg-gray-800'
              }`}
            >
              {loading ? "Processing..." : 
               paymentMethod === 'cod' ? "Place Order" : `Pay via ${paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;