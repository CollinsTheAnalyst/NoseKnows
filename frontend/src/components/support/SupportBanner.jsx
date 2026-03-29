// src/components/support/SupportBanner.jsx
import React from "react";
import { MessageCircle, Phone, Mail } from "lucide-react";
import supportBg from "../../assets/noseknowshero.png";

const SupportBanner = () => {
  return (
    <section className="relative w-full h-[300px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
        style={{ 
          backgroundImage: `url(${supportBg})`,
        }}
      >
        {/* Darkened Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 text-center px-6">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-8 font-montserrat tracking-wide">
          Need Help With Your Order?
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {/* WhatsApp */}
          <a 
            href="https://wa.me/254704829991" 
            className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#128C7E] transition shadow-lg"
          >
            <MessageCircle size={20} />
            WhatsApp Us
          </a>

          {/* Call */}
          <a 
            href="tel:+254704829991" 
            className="flex items-center gap-2 bg-[#E91E63] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#C2185B] transition shadow-lg"
          >
            <Phone size={20} />
            Call: +254704829991
          </a>

          {/* Email */}
          <a 
            href="mailto:info@noseknows.co.ke" 
            className="flex items-center gap-2 bg-[#8E44AD] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7D3C98] transition shadow-lg"
          >
            <Mail size={20} />
            Email Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default SupportBanner;