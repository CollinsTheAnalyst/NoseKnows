// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingCart, MessageCircle, Star, Info, Wind, Droplets, Leaf } from "lucide-react";
import CartModal from "../components/cart/cartmodal"; 
import { useCart } from "../context/cartcontext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // State for tabs

  const { addToCart, openCart, wishlistItems, addToWishlist, removeFromWishlist } = useCart();

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

  if (loading) return <p className="text-center py-16">Loading...</p>;
  if (!product) return <p className="text-center py-16 text-red-500">Product not found</p>;

  // Function to parse Scent Notes (expects "Top: X, Heart: Y, Base: Z")
  const parseNotes = (notesString) => {
    if (!notesString) return null;
    const parts = notesString.split(',').reduce((acc, part) => {
      const [key, value] = part.split(':').map(s => s.trim());
      if (key && value) acc[key.toLowerCase()] = value;
      return acc;
    }, {});
    return parts;
  };

  const notes = parseNotes(product.scent_notes);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 text-sm text-gray-500">
        <Link to="/" className="hover:text-accentPink">Home</Link> /{" "}
        <Link to="/shop" className="hover:text-accentPink">Shop</Link> / {product.name}
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-12">
        {/* Left: Images */}
        <div className="lg:w-1/2">
           <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <img src={selectedImage} alt={product.name} className="w-full h-[500px] object-contain mx-auto" />
           </div>
           <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
              {product.images?.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img.image_url} 
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`w-20 h-20 rounded-lg cursor-pointer border-2 transition ${selectedImage === img.image_url ? "border-accentPink" : "border-transparent bg-white"}`}
                />
              ))}
           </div>
        </div>

        {/* Right: Info & Purchase */}
        <div className="lg:w-1/2 space-y-6">
          <div>
            <p className="text-accentPink font-semibold tracking-widest uppercase text-sm mb-2">{product.brand?.name}</p>
            <h1 className="text-4xl font-playfair font-bold text-[#00306b]">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-yellow-500">
               <Star size={16} fill="currentColor" />
               <Star size={16} fill="currentColor" />
               <Star size={16} fill="currentColor" />
               <Star size={16} fill="currentColor" />
               <Star size={16} fill="currentColor" />
               <span className="text-gray-400 text-sm ml-2">(4.8/5 based on 12 reviews)</span>
            </div>
          </div>

          <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800">Select Volume</h3>
            <div className="flex flex-wrap gap-3">
              {product.variants?.map((v) => (
                <button 
                  key={v.id} 
                  onClick={() => setSelectedVariant(v)}
                  className={`px-6 py-2 rounded-full border-2 transition-all ${selectedVariant?.id === v.id ? "border-accentPink bg-pink-50 text-accentPink" : "border-gray-100 text-gray-500 hover:border-accentPink"}`}
                >
                  {v.size}
                </button>
              ))}
            </div>
            <p className="text-3xl font-bold text-[#00306b]">Ksh {selectedVariant?.price?.toLocaleString()}</p>
          </div>

          <div className="flex gap-4">
             <button onClick={() => addToCart({...product, selectedVariant})} className="flex-[2] bg-[#00306b] text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-3">
                <ShoppingCart size={20} /> Add to Cart
             </button>
             <button className="flex-1 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-pink-50 hover:border-accentPink transition-all">
                <Heart size={20} className="text-gray-400" />
             </button>
          </div>
        </div>
      </section>

      {/* Tabs Section: Description, Notes, Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex border-b border-gray-200 gap-8 mb-8">
          {["description", "notes", "reviews"].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === tab ? "border-b-2 border-accentPink text-accentPink" : "text-gray-400 hover:text-gray-600"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 min-h-[300px]">
          {activeTab === "description" && (
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              <p>{product.description || "No description available for this fragrance."}</p>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-3 p-6 bg-blue-50 rounded-2xl">
                <Wind className="text-blue-500" size={32} />
                <h4 className="font-bold text-gray-800">Top Notes</h4>
                <p className="text-sm text-gray-600">{notes?.top || "Sparkling citrus, Bergamot"}</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3 p-6 bg-pink-50 rounded-2xl">
                <Droplets className="text-accentPink" size={32} />
                <h4 className="font-bold text-gray-800">Heart Notes</h4>
                <p className="text-sm text-gray-600">{notes?.heart || "Jasmine, Tuberose"}</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3 p-6 bg-orange-50 rounded-2xl">
                <Leaf className="text-orange-500" size={32} />
                <h4 className="font-bold text-gray-800">Base Notes</h4>
                <p className="text-sm text-gray-600">{notes?.base || "Vanilla, White Musk"}</p>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-[#00306b]">Customer Stories</h4>
              {/* This is a placeholder for your reviews logic */}
              <div className="border-b pb-6">
                <div className="flex gap-1 text-yellow-500 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 italic">"The longevity is incredible. I get compliments every time I wear it!"</p>
                <p className="text-sm font-bold mt-2">— Sarah K.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;