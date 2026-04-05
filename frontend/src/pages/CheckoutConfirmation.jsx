// src/pages/CheckoutConfirmation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle, ArrowRight, ShoppingBag, 
  Star, Send, MessageSquare 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const CheckoutConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. ✅ Get data from the 'navigate' state passed from Checkout.jsx
  // We use location.state.purchasedItems because the global cart is now empty
  const customerName = location.state?.customerName || "Valued Customer";
  const orderID = location.state?.orderID || `NK-${Math.floor(Math.random() * 90000) + 10000}`;
  const purchasedItems = location.state?.purchasedItems || [];
  
  const [ratedItems, setRatedItems] = useState({});
  const [hoveredStars, setHoveredStars] = useState({});
  const [comments, setComments] = useState({});
  const [submitted, setSubmitted] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    // Safety check: if no order info, send them back to shop
    if (!location.state) {
      navigate('/shop');
    }
  }, [location, navigate]);

  const handleRate = (productId, rating) => {
    setRatedItems({ ...ratedItems, [productId]: rating });
  };

  const handleTextChange = (productId, text) => {
    setComments({ ...comments, [productId]: text });
  };

  const addTag = (productId, tag) => {
    const currentText = comments[productId] || '';
    if (!currentText.includes(tag)) {
      setComments({ ...comments, [productId]: `${currentText} ${tag}`.trim() });
    }
  };

  const submitReview = async (productId) => {
    const reviewData = {
      product: productId,         
      guest_name: customerName,   
      order_number: orderID,      
      rating: ratedItems[productId],
      comment: comments[productId] || "",
      is_verified: true,          
    };

    try {
      const response = await fetch(`${API_URL}/api/reviews/reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        setSubmitted({ ...submitted, [productId]: true });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-40 pb-20 px-4 flex flex-col items-center font-sans">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600;700;800&display=swap');
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-sans { font-family: 'Inter', sans-serif; }
        `}
      </style>

      <div className="max-w-3xl w-full space-y-8">
        
        {/* SUCCESS CARD */}
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 text-center space-y-6 animate-in fade-in zoom-in duration-700">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 animate-bounce">
              <CheckCircle size={40} />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-playfair font-black text-[#042540]">Order Confirmed!</h1>
            <p className="text-gray-500 text-lg uppercase tracking-tighter font-bold">
              Thank you, {customerName.split(' ')[0]}!
            </p>
            <p className="text-gray-400 font-medium">Your luxury scent is being prepared for dispatch.</p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-6 flex justify-around items-center border border-gray-100/50">
             <div className="text-left">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
               <p className="font-bold text-[#042540]">{orderID}</p>
             </div>
             <div className="w-[1px] h-8 bg-gray-200"></div>
             <div className="text-left">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expected Arrival</p>
               <p className="font-bold text-[#042540]">24 - 48 Hours</p>
             </div>
          </div>
        </div>

        {/* REVIEW SECTION */}
        <div className="bg-[#042540] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-accentPink/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-accentPink rounded-2xl shadow-lg shadow-accentPink/20">
                <Star size={24} fill="white" className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-playfair">How was your experience?</h2>
                <p className="text-blue-200/60 text-xs font-medium uppercase tracking-widest mt-1">Help others choose their signature scent.</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* ✅ Mapping over purchasedItems instead of cartItems */}
              {purchasedItems.map((item) => (
                <div key={item.id} className="bg-white/5 border border-white/10 rounded-[32px] p-6 transition-all hover:bg-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img src={item.images?.[0]?.image_url || item.image} alt={item.name} className="w-16 h-16 object-contain bg-white rounded-2xl p-2 shadow-xl" />
                      <div>
                        <p className="font-bold text-sm leading-tight">{item.name}</p>
                        <p className="text-[9px] text-blue-300 uppercase font-black tracking-[0.2em] mt-1">Verified Purchase</p>
                      </div>
                    </div>

                    {!submitted[item.id] && (
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onMouseEnter={() => setHoveredStars({ ...hoveredStars, [item.id]: star })}
                            onMouseLeave={() => setHoveredStars({ ...hoveredStars, [item.id]: 0 })}
                            onClick={() => handleRate(item.id, star)}
                            className="transition-transform active:scale-125"
                          >
                            <Star 
                              size={22} 
                              fill={(ratedItems[item.id] || hoveredStars[item.id] || 0) >= star ? "#facc15" : "transparent"} 
                              className={(ratedItems[item.id] || hoveredStars[item.id] || 0) >= star ? "text-yellow-400" : "text-white/20"} 
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {ratedItems[item.id] && !submitted[item.id] && (
                    <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {['Long lasting', 'Smells Amazing', 'Gift Ready', 'Original'].map(tag => (
                          <button 
                            key={tag}
                            onClick={() => addTag(item.id, tag)}
                            className="text-[9px] font-bold bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-all uppercase tracking-widest"
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>
                      
                      <div className="relative">
                        <textarea
                          value={comments[item.id] || ''}
                          onChange={(e) => handleTextChange(item.id, e.target.value)}
                          placeholder="What did you love about this scent?"
                          className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-blue-200/30 focus:outline-none focus:ring-2 focus:ring-accentPink/50 transition-all h-24 resize-none"
                        />
                        <button 
                          onClick={() => submitReview(item.id)}
                          className="absolute bottom-3 right-3 bg-accentPink hover:bg-pink-600 p-3 rounded-xl transition-all active:scale-90 shadow-lg"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {submitted[item.id] && (
                    <div className="flex items-center gap-2 text-green-400 font-bold text-sm py-3 justify-center bg-green-400/10 rounded-2xl animate-in zoom-in duration-300">
                      <CheckCircle size={16} /> Review Submitted! Thank you.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => navigate('/shop')} className="flex-1 bg-white border-2 border-gray-100 text-[#042540] py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
            <ShoppingBag size={18} /> Continue Shopping
          </button>
          <button onClick={() => navigate('/shop')} className="flex-1 bg-[#042540] text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:shadow-2xl transition-all">
            Back to Home <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutConfirmation;