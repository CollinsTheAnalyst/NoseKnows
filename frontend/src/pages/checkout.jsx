import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartcontext.jsx";
import { CreditCard, Truck, ShieldCheck, MapPin, User, Mail, Phone } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  // Form States
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "Nairobi",
    phone: "",
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
    if (!formData.phone.startsWith("254") || formData.phone.length !== 12) {
      alert("Format: 2547XXXXXXXX");
      return;
    }

    setLoading(true);
    try {
      // Send both order details and payment info
      await axios.post("http://127.0.0.1:8000/api/checkout/mpesa-pay/", {
        ...formData,
        amount: cartTotal,
        items: cartItems, 
      });
      alert("✅ STK Push sent! Enter PIN on your phone.");
      navigate("/checkout/confirmation");
    } catch (error) {
      alert("❌ Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-[140px] pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* LEFT: Shipping & Payment Details */}
        <div className="flex-[1.8] space-y-8">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-playfair font-bold text-[#00306b] mb-8 flex items-center gap-3">
              <Truck size={24} className="text-accentPink" /> Delivery Information
            </h2>
            
            <form id="checkout-form" onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-300" size={18} />
                  <input name="firstName" required onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 border-transparent transition-all" placeholder="Collins" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Last Name</label>
                <input name="lastName" required onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100" placeholder="Nose" />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-300" size={18} />
                  <input type="email" name="email" required onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl outline-none" placeholder="collins@example.com" />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Delivery Address (Street/Apartment)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-300" size={18} />
                  <input name="address" required onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl outline-none" placeholder="Imenti House, Room 4" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">City</label>
                <select name="city" onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none border-r-8 border-transparent cursor-pointer">
                  <option>Nairobi</option>
                  <option>Mombasa</option>
                  <option>Kisumu</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-accentPink">M-Pesa Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-accentPink" size={18} />
                  <input name="phone" required onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-pink-50 rounded-xl outline-none border border-pink-100 text-[#00306b] font-bold" placeholder="254712345678" />
                </div>
              </div>
            </form>
          </section>

          {/* Payment Method Selector */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-[#00306b] mb-6">Payment Method</h2>
             <div className="flex gap-4">
                <div className="flex-1 p-4 border-2 border-[#00306b] rounded-2xl bg-blue-50 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-black text-xs">M</div>
                      <span className="font-bold text-[#00306b]">M-Pesa</span>
                   </div>
                   <div className="w-5 h-5 rounded-full border-4 border-[#00306b] bg-white"></div>
                </div>
                <div className="flex-1 p-4 border border-gray-100 rounded-2xl opacity-40 grayscale flex items-center gap-3">
                   <CreditCard className="text-gray-400" />
                   <span className="font-medium">Card (Disabled)</span>
                </div>
             </div>
          </section>
        </div>

        {/* RIGHT: Order Summary (Sticky) */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-50 sticky top-32">
            <h3 className="text-xl font-bold text-[#00306b] mb-6">Your Order</h3>
            
            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.cartId} className="flex gap-4 items-center">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-gray-50 rounded-xl" />
                    <span className="absolute -top-2 -right-2 bg-accentPink text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-800 truncate">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">{item.selectedVariant?.size}</p>
                  </div>
                  <p className="font-bold text-[#00306b] text-sm">Ksh {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-50">
              <div className="flex justify-between text-gray-500 text-sm font-medium">
                <span>Subtotal</span>
                <span>Ksh {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm font-medium">
                <span>Shipping</span>
                <span className="text-green-500 font-bold uppercase text-[10px]">Free Delivery</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-gray-800 font-bold">Total</span>
                <span className="text-2xl font-bold text-accentPink">Ksh {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              form="checkout-form"
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-[#00306b] text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:bg-gray-200"
            >
              {loading ? "Confirming..." : "Complete Purchase"}
            </button>
            
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <ShieldCheck size={14} className="text-green-500" /> Secure SSL Encrypted Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;