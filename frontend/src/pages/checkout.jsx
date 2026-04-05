// src/pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/cartcontext.jsx";
import { 
  CreditCard, Truck, ShieldCheck, MapPin, 
  Smartphone, Lock, Wallet, Trash2, 
  Minus, Plus, ChevronRight
} from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [isOrderComplete, setIsOrderComplete] = useState(false); // ✅ Added this state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "Nairobi",
    phone: "254",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });
  const [loading, setLoading] = useState(false);

  // ✅ UPDATED: Only redirect to shop if the cart is empty AND an order isn't in progress
  useEffect(() => {
    window.scrollTo(0, 0);
    if (cartItems.length === 0 && !loading && !isOrderComplete) {
      navigate("/shop");
    }
  }, [cartItems, navigate, loading, isOrderComplete]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        let endpoint = "";
        if (paymentMethod === "mpesa") {
            if (!formData.phone.startsWith("254") || formData.phone.length !== 12) {
                alert("Please use format: 2547XXXXXXXX");
                setLoading(false);
                return;
            }
            endpoint = "http://127.0.0.1:8000/api/checkout/mpesa-pay/";
        } else if (paymentMethod === "card") {
            endpoint = "http://127.0.0.1:8000/api/checkout/card-pay/";
        } else {
            endpoint = "http://127.0.0.1:8000/api/checkout/cod-pay/";
        }

        const payload = { ...formData, amount: cartTotal, items: cartItems, paymentMethod };
        const response = await axios.post(endpoint, payload);
        
        const confirmationState = {
            customerName: `${formData.firstName} ${formData.lastName}`,
            orderID: response.data.order_id || `NK-${Math.floor(Math.random() * 90000) + 10000}`,
            purchasedItems: [...cartItems] // ✅ Create a copy to pass over
        };

        // ✅ THE FIX: Set order as complete BEFORE clearing cart/navigating
        setIsOrderComplete(true); 
        
        navigate("/checkout/confirmation", { state: confirmationState });
        
        // Clear cart after a slight delay to ensure state transfer is smooth
        setTimeout(() => clearCart(), 500);

    } catch (error) {
        console.error(error);
        alert("❌ Order processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-[140px] pb-20 px-4 sm:px-6 font-sans selection:bg-[#042540] selection:text-white">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700;800&display=swap');
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-sans { font-family: 'Inter', sans-serif; }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-10 text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
           <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
           <ChevronRight size={12} />
           <span className="text-[#042540]">Checkout</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* LEFT: DELIVERY & PAYMENT */}
          <div className="flex-[1.8] w-full space-y-8">
            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-3xl font-playfair font-black text-[#042540] mb-8 flex items-center gap-4">
                <Truck className="text-accentPink" size={32} /> Delivery Info
              </h2>
              
              <form id="checkout-form" onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">First Name</label>
                  <input name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 focus:bg-white outline-none transition-all font-semibold" placeholder="Collins" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Last Name</label>
                  <input name="lastName" required value={formData.lastName} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 focus:bg-white outline-none transition-all font-semibold" placeholder="Nose" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 focus:bg-white outline-none transition-all font-semibold" placeholder="collins@example.com" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Shipping Address (Nairobi)</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-5 text-gray-300" size={18} />
                    <input name="address" required value={formData.address} onChange={handleInputChange} className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 focus:bg-white outline-none transition-all font-semibold" placeholder="Imenti House, Room 4" />
                  </div>
                </div>
              </form>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-3xl font-playfair font-black text-[#042540] mb-8">Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {[
                  { id: "mpesa", label: "M-Pesa", icon: Smartphone },
                  { id: "card", label: "Credit Card", icon: CreditCard },
                  { id: "cod", label: "On Delivery", icon: Wallet }
                ].map((m) => (
                  <button 
                    key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
                    className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${
                      paymentMethod === m.id ? "border-[#042540] bg-[#042540]/5" : "border-gray-50 opacity-40 hover:opacity-100 hover:bg-gray-50"
                    }`}
                  >
                    <m.icon size={28} className={paymentMethod === m.id ? "text-[#042540]" : "text-gray-400"} />
                    <span className="font-black text-[10px] uppercase tracking-widest">{m.label}</span>
                  </button>
                ))}
              </div>

              <div className="bg-[#F8F9FB] p-8 rounded-[2rem] border border-dashed border-gray-200">
                {paymentMethod === "mpesa" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500 max-w-sm mx-auto text-center">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 block">Phone Number</label>
                    <input 
                      name="phone" required form="checkout-form"
                      value={formData.phone} onChange={handleInputChange} 
                      className="w-full px-8 py-5 bg-white rounded-2xl border-none text-[#042540] font-black text-lg tracking-[0.1em] focus:ring-4 focus:ring-green-100 shadow-sm font-mono text-center" 
                      placeholder="2547XXXXXXXX"
                    />
                  </div>
                )}
                
                {paymentMethod === "card" && (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Card Number</label>
                        <input name="cardNumber" onChange={handleInputChange} className="w-full px-6 py-4 bg-white rounded-2xl border-none shadow-sm font-mono tracking-widest" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input name="expiry" onChange={handleInputChange} className="px-6 py-4 bg-white rounded-2xl border-none shadow-sm font-mono" placeholder="MM / YY" />
                        <input name="cvc" onChange={handleInputChange} className="px-6 py-4 bg-white rounded-2xl border-none shadow-sm font-mono" placeholder="CVC" />
                    </div>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="flex items-center gap-4 py-4 px-6 bg-white rounded-2xl shadow-sm justify-center">
                    <ShieldCheck size={32} className="text-blue-500" />
                    <p className="text-gray-600 text-sm font-medium leading-relaxed uppercase tracking-wider font-bold">Pay on Delivery</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="flex-1 w-full lg:sticky lg:top-[120px]">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-50 relative overflow-hidden">
              <h3 className="text-2xl font-playfair font-black text-[#042540] mb-8">Your Order</h3>
              
              <div className="space-y-6 max-h-[450px] overflow-y-auto no-scrollbar mb-8 pr-2">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="flex gap-5 group animate-in fade-in">
                    <div className="w-24 h-24 bg-[#F8F9FB] rounded-2xl overflow-hidden p-3 flex-shrink-0 border border-gray-100 relative">
                       <img src={item.images?.[0]?.image_url || item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                       <button 
                        type="button"
                        onClick={() => removeFromCart(item.cartId)}
                        className="absolute -top-1 -right-1 bg-white shadow-xl text-red-500 p-2 rounded-full hover:bg-red-50 transition-all z-20"
                       >
                         <Trash2 size={14} />
                       </button>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div>
                        <h4 className="font-bold text-sm text-[#042540] leading-tight line-clamp-2">{item.name}</h4>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{item.selectedVariant?.size}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                          <button type="button" onClick={() => updateQuantity(item.cartId, Math.max(1, item.quantity - 1))} className="p-1.5 hover:text-accentPink transition-colors"><Minus size={12} strokeWidth={3}/></button>
                          <span className="w-8 text-center text-xs font-black text-[#042540]">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="p-1.5 hover:text-accentPink transition-colors"><Plus size={12} strokeWidth={3}/></button>
                        </div>
                        <p className="font-black text-[#042540] text-sm italic">Ksh {(Number(item.selectedVariant?.price || 0) * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-50 relative">
                <div className="flex justify-between text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <span>Subtotal</span>
                  <span>Ksh {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                  <span className="text-[#042540] font-playfair font-black text-xl">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-playfair font-black text-accentPink leading-none tracking-tighter">Ksh {cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                form="checkout-form"
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full mt-10 bg-[#042540] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 hover:shadow-2xl hover:translate-y-[-2px] active:scale-95 disabled:bg-gray-200"
              >
                {loading ? "Processing..." : `Place Order`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;