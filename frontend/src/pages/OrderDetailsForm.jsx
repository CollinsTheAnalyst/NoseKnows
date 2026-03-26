import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartcontext.jsx";
import { Phone, MapPin, User, Mail, StickyNote, CreditCard, Wallet, ChevronRight, ShieldCheck } from "lucide-react";

const OrderDetailsForm = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  // ✅ FIXED: Defensive calculation to prevent NaN
  const totalAmount = cartItems.reduce((sum, item) => {
    const rawPrice = item.selectedVariant?.price || item.price || 0;
    const cleanPrice = typeof rawPrice === "string" 
      ? parseFloat(rawPrice.replace(/,/g, "")) 
      : Number(rawPrice);
    return sum + (cleanPrice * item.quantity);
  }, 0);

  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "254", 
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
        items: cartItems.map(item => {
          // ✅ FIXED: Ensure price is a valid number for payload
          const rawPrice = item.selectedVariant?.price || item.price || 0;
          const cleanPrice = typeof rawPrice === "string" 
            ? parseFloat(rawPrice.replace(/,/g, "")) 
            : Number(rawPrice);

          return {
            product_id: item.id,
            quantity: item.quantity,
            price: cleanPrice,
            size: item.selectedVariant?.size
          };
        })
      };

      const endpoint = paymentMethod === "mpesa" 
        ? "http://127.0.0.1:8000/api/checkout/mpesa-pay/" 
        : "http://127.0.0.1:8000/api/checkout/create-order/";

      const response = await axios.post(endpoint, payload);

      if (paymentMethod === "mpesa") {
        const { checkout_id } = response.data; 
        alert("✅ STK Push sent. Please enter your PIN on your phone.");

        const interval = setInterval(async () => {
          try {
            const statusRes = await axios.get(`http://127.0.0.1:8000/api/checkout/check-status/${checkout_id}/`);
            if (statusRes.data.status === "COMPLETED") {
              clearInterval(interval);
              alert("✅ Payment Received!");
              clearCart();
              navigate("/checkout/confirmation");
            } else if (statusRes.data.status === "FAILED") {
              clearInterval(interval);
              alert("❌ Payment failed or cancelled.");
              setLoading(false);
            }
          } catch (err) {
            console.error("Polling error", err);
          }
        }, 3000); 
      } else {
        alert("✅ Order placed successfully!");
        clearCart();
        navigate("/checkout/confirmation");
      }
    } catch (error) {
      alert("❌ Transaction failed.");
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 pt-32">
        <h2 className="text-2xl font-bold">Your cart is empty!</h2>
        <button onClick={() => navigate("/shop")} className="mt-4 px-8 py-3 bg-[#00306b] text-white rounded-full">Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-40 pb-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        <div className="flex-[1.8] space-y-8">
          <form id="order-form" onSubmit={handlePlaceOrder}>
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold text-[#00306b] mb-8 flex items-center gap-3">
                <MapPin size={24} className="text-pink-500" /> Delivery Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-300" size={18} />
                    <input name="name" required onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl outline-none" placeholder="Collins Nose" />
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
                  <label className="text-xs font-bold uppercase text-gray-400">Address</label>
                  <input name="address" required onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none" placeholder="Nairobi, Kenya" />
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#00306b] mb-8">Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div onClick={() => setPaymentMethod("mpesa")} className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col items-center gap-3 ${paymentMethod === 'mpesa' ? 'border-[#00306b] bg-blue-50' : 'border-gray-100'}`}>
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-black">M</div>
                  <span className="text-sm font-bold">M-Pesa</span>
                </div>
                <div onClick={() => setPaymentMethod("cod")} className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col items-center gap-3 ${paymentMethod === 'cod' ? 'border-[#00306b] bg-blue-50' : 'border-gray-100'}`}>
                  <Wallet size={32} className={paymentMethod === 'cod' ? 'text-[#00306b]' : 'text-gray-400'} />
                  <span className="text-sm font-bold">Pay on Delivery</span>
                </div>
              </div>

              {paymentMethod === "mpesa" && (
                <div className="space-y-2 animate-in fade-in">
                  <label className="text-xs font-bold uppercase text-pink-500">M-Pesa Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 text-pink-400" size={18} />
                    <input name="phone" required value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-pink-50 rounded-xl outline-none border border-pink-100" />
                  </div>
                </div>
              )}
            </section>
          </form>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-50 sticky top-32">
            <h3 className="text-xl font-bold text-[#00306b] mb-6 border-b pb-4">Order Summary</h3>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => {
                // ✅ FIXED: Same defensive logic for individual item rows
                const rawItemPrice = item.selectedVariant?.price || item.price || 0;
                const cleanItemPrice = typeof rawItemPrice === "string" 
                  ? parseFloat(rawItemPrice.replace(/,/g, "")) 
                  : Number(rawItemPrice);

                return (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{item.name} x {item.quantity}</span>
                    <span className="font-bold text-[#00306b]">
                      Ksh {(cleanItemPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="border-t pt-4 flex justify-between items-end">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-bold text-pink-600">Ksh {totalAmount.toLocaleString()}</span>
            </div>
            <button form="order-form" type="submit" disabled={loading} className="w-full mt-8 bg-[#00306b] text-white py-4 rounded-2xl font-bold hover:shadow-2xl transition-all disabled:bg-gray-300">
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsForm;