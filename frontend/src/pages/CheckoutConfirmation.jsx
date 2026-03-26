import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';

const CheckoutConfirmation = () => {
  const navigate = useNavigate();
  // In a real app, you could fetch the last order from localStorage or state
  const orderNumber = Math.floor(Math.random() * 90000) + 10000; 

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-40 pb-20 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center space-y-8">
        
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle size={48} className="text-green-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-playfair font-bold text-[#00306b]">Order Confirmed!</h1>
          <p className="text-gray-500 text-lg">
            Thank you for shopping with NoseKnows. Your luxury scents are being prepared for delivery.
          </p>
        </div>

        {/* Order Card */}
        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <Package className="text-pink-500" size={20} />
            <div className="text-left">
              <p className="text-xs font-bold text-gray-400 uppercase">Order Number</p>
              <p className="font-bold text-[#00306b]">#NK-{orderNumber}</p>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-gray-200 hidden md:block"></div>
          <div className="text-left">
            <p className="text-xs font-bold text-gray-400 uppercase">Estimated Delivery</p>
            <p className="font-bold text-[#00306b]">24 - 48 Hours</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            onClick={() => navigate('/shop')}
            className="flex-1 bg-[#00306b] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </button>
          <button 
            onClick={() => navigate('/account/orders')}
            className="flex-1 border-2 border-[#00306b] text-[#00306b] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
          >
            Track Order
            <ArrowRight size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-400">
          A confirmation email has been sent to your inbox.
        </p>
      </div>
    </div>
  );
};

export default CheckoutConfirmation;