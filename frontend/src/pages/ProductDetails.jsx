// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Heart, ShoppingCart, Star, Wind, Droplets, Leaf, 
  Truck, ShieldCheck, Zap, Minus, Plus, Share2, 
  CheckCircle2, Clock, Smartphone
} from "lucide-react";
import { useCart } from "../context/cartcontext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${API_URL}/api/products/`)
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.results.find((p) => p.slug === slug);
        setProduct(foundProduct);
        setSelectedImage(foundProduct?.images?.[0]?.image_url || "");
        setSelectedVariant(foundProduct?.variants?.[0] || null);
      })
      .catch((err) => console.error("Failed to fetch product:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accentPink"></div>
  </div>;
  
  if (!product) return <p className="text-center py-16 text-red-500 font-bold">Product not found</p>;

  const parseNotes = (notesString) => {
    if (!notesString) return null;
    return notesString.split(',').reduce((acc, part) => {
      const [key, value] = part.split(':').map(s => s.trim());
      if (key && value) acc[key.toLowerCase()] = value;
      return acc;
    }, {});
  };

  const notes = parseNotes(product.scent_notes);

  return (
    <div className="min-h-screen bg-white pb-20 overflow-x-hidden">
      {/* BREADCRUMBS */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 text-[11px] uppercase tracking-widest text-gray-400 font-bold">
        <Link to="/" className="hover:text-black">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-black">Collection</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col lg:flex-row gap-12">
        
        {/* LEFT: IMAGE GALLERY (Amazon/Scentfied Style) */}
        <div className="lg:w-[55%] space-y-4">
          <div className="relative group bg-[#F9F9F9] rounded-3xl overflow-hidden border border-gray-100">
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="w-full h-[600px] object-contain mx-auto transition-transform duration-700 group-hover:scale-110" 
            />
            {/* Tag Overlay like Kilimall */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              <span className="bg-black text-white text-[10px] font-black px-3 py-1 uppercase tracking-tighter rounded-full flex items-center gap-1">
                <Zap size={12} fill="white"/> Best Seller
              </span>
            </div>
            <button className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all text-gray-400 hover:text-accentPink">
              <Heart size={20} />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            {product.images?.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(img.image_url)}
                className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all p-1 ${selectedImage === img.image_url ? "border-accentPink bg-white" : "border-transparent bg-gray-50"}`}
              >
                <img src={img.image_url} className="w-full h-full object-contain" alt="thumbnail" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: BUYING PANEL (Jumia/Kilimall Hybrid) */}
        <div className="lg:w-[45%] space-y-8">
          <div>
            <div className="flex items-center justify-between mb-2">
               <span className="text-accentPink font-black uppercase tracking-[0.3em] text-[10px]">{product.brand?.name}</span>
               <Share2 size={18} className="text-gray-400 cursor-pointer hover:text-black" />
            </div>
            <h1 className="text-4xl font-playfair font-black text-[#042540] leading-none mb-4 uppercase tracking-tighter">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-xs font-bold text-gray-400 underline cursor-pointer hover:text-black">12 Verified Reviews</span>
              <span className="h-4 w-[1px] bg-gray-200"></span>
              <span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle2 size={14}/> In Stock</span>
            </div>
          </div>

          {/* Pricing Block */}
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="flex items-baseline gap-3 mb-6">
               <span className="text-4xl font-black text-[#042540]">Ksh {selectedVariant?.price?.toLocaleString()}</span>
               <span className="text-lg text-gray-400 line-through">Ksh {(selectedVariant?.price * 1.2).toLocaleString()}</span>
               <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded">-20%</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Bottle Size</h3>
                <span className="text-[10px] font-bold text-accentPink underline uppercase">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants?.map((v) => (
                  <button 
                    key={v.id} 
                    onClick={() => setSelectedVariant(v)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${selectedVariant?.id === v.id ? "bg-black text-white shadow-lg scale-105" : "bg-white text-gray-500 border border-gray-200 hover:border-black"}`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector like Amazon */}
            <div className="mt-8 flex items-center gap-6">
              <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-accentPink transition-colors"><Minus size={16}/></button>
                <span className="w-10 text-center font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-accentPink transition-colors"><Plus size={16}/></button>
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase leading-tight">
                Limited Stock! <br/> <span className="text-red-500">Only 5 left in Nairobi</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => addToCart({...product, selectedVariant, quantity})} 
              className="w-full bg-[#00306b] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:shadow-2xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <ShoppingCart size={20} /> Add to Collection
            </button>
            
            {/* Express M-Pesa Checkout Signal */}
            <button className="w-full bg-[#39b54a] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3">
              <Smartphone size={18} /> Buy Now with M-Pesa
            </button>
          </div>

          {/* Trust Signals Block (Kilimall style) */}
          <div className="grid grid-cols-1 gap-4 pt-4">
             <div className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <Truck className="text-blue-500" size={24} />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-800">Next Day Delivery</p>
                  <p className="text-[10px] text-gray-500 font-medium">Free for orders within Nairobi over Ksh 10,000.</p>
                </div>
             </div>
             <div className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <ShieldCheck className="text-accentPink" size={24} />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-800">100% Authentic Scents</p>
                  <p className="text-[10px] text-gray-500 font-medium">Money-back guarantee on all our collection.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Scent Notes Visualization (Amazon/Editorial Juice) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-12">
           <h2 className="text-3xl font-playfair font-bold text-[#042540]">The Fragrance Journey</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Wind, label: "Top Notes", value: notes?.top, color: "text-blue-400", bg: "bg-blue-50", desc: "The immediate burst" },
            { icon: Droplets, label: "Heart Notes", value: notes?.heart, color: "text-accentPink", bg: "bg-pink-50", desc: "The core identity" },
            { icon: Leaf, label: "Base Notes", value: notes?.base, color: "text-orange-400", bg: "bg-orange-50", desc: "The lasting trail" }
          ].map((item, i) => (
            <div key={i} className={`group p-8 rounded-[40px] ${item.bg} hover:scale-105 transition-all duration-500 text-center relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <item.icon size={120} />
              </div>
              <item.icon className={`${item.color} mx-auto mb-4`} size={40} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{item.desc}</p>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{item.label}</h4>
              <p className="text-gray-600 font-medium">{item.value || "Not specified"}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TABS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="flex border-b border-gray-100 gap-12 mb-12 overflow-x-auto no-scrollbar">
          {["description", "shipping", "reviews"].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs font-black uppercase tracking-[0.3em] whitespace-nowrap transition-all relative ${activeTab === tab ? "text-accentPink after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-accentPink" : "text-gray-300 hover:text-gray-500"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="prose max-w-none text-gray-600 leading-relaxed font-medium">
          {activeTab === "description" && <p className="text-lg">{product.description || "Indulge in a sensory experience designed for the modern individual."}</p>}
          {activeTab === "shipping" && (
            <div className="space-y-4">
              <p className="flex items-center gap-3"><Clock size={16} className="text-accentPink"/> Orders before 12:00 PM are delivered same day in Nairobi.</p>
              <p className="flex items-center gap-3"><Smartphone size={16} className="text-green-500"/> Cash on delivery available via M-Pesa for regular customers.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;