// src/pages/ProductDetails.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; 
import { 
  Heart, ShoppingCart, Star, Wind, Droplets, Leaf, 
  Truck, ShieldCheck, Minus, Plus, Share2, 
  CheckCircle2, Smartphone, MessageSquare, 
  ShieldCheck as VerifiedIcon
} from "lucide-react";
import { useCart } from "../context/cartcontext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate(); 
  const reviewsRef = useRef(null);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Destructure wishlist functions from your context
  const { addToCart, addToWishlist, wishlistItems, removeFromWishlist } = useCart();
  
  // Derived state for wishlist global sync
  const isWishlisted = wishlistItems?.some(item => item.id === product?.id);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`${API_URL}/api/products/`)
      .then((res) => res.json())
      .then((data) => {
        const allProducts = data.results || [];
        const foundProduct = allProducts.find((p) => p.slug === slug);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedImage(foundProduct?.images?.[0]?.image_url || "");
          setSelectedVariant(foundProduct?.variants?.[0] || null);
          
          // FIX: Improved Related Products logic (Brand match or Category match)
          const related = allProducts
            .filter(p => 
              p.slug !== slug && 
              (p.brand?.id === foundProduct.brand?.id || 
               p.categories?.some(cat => foundProduct.categories?.map(c => c.id).includes(cat.id)))
            )
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
          setRelatedProducts(related);
        }
      })
      .catch((err) => console.error("Failed to fetch product:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  const scrollToReviews = () => {
    setActiveTab("reviews");
    setTimeout(() => {
      reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleWhatsAppCheckout = () => {
    const message = `Hello NoseKnows, I'd like to order:\n\n*Product:* ${product.name}\n*Size:* ${selectedVariant?.size}\n*Quantity:* ${quantity}\n*Price:* Ksh ${Number(selectedVariant?.price).toLocaleString()}\n\nLink: ${window.location.href}`;
    window.open(`https://wa.me/254714326105?text=${encodeURIComponent(message)}`, "_blank");
  };

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#042540]"></div>
    </div>
  );
  
  if (!product) return <p className="text-center py-16 text-red-500 font-bold">Product not found</p>;

  const reviewsList = product.product_reviews || [];
  const liveReviewCount = reviewsList.length;
  const liveAverageRating = liveReviewCount > 0 
    ? (reviewsList.reduce((acc, item) => acc + item.rating, 0) / liveReviewCount).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-white pb-20 overflow-x-hidden font-sans selection:bg-[#042540] selection:text-white">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700;800&display=swap');
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-sans { font-family: 'Inter', sans-serif; }
        `}
      </style>

      {/* BREADCRUMBS */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-black transition-colors">Collection</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-16">
        
        {/* LEFT: IMAGE GALLERY */}
        <div className="lg:w-[50%] space-y-6">
          <div className="relative aspect-[4/5] bg-[#f9f9f9] rounded-[2.5rem] overflow-hidden border border-gray-100 group">
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="w-full h-full object-contain p-12 transition-transform duration-1000 group-hover:scale-105" 
            />
            <button 
              onClick={toggleWishlist}
              className="absolute top-8 right-8 p-4 bg-white shadow-2xl rounded-full transition-all active:scale-90 z-10"
            >
              <Heart size={24} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-300"} />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
            {product.images?.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(img.image_url)}
                className={`flex-shrink-0 w-24 h-28 rounded-2xl overflow-hidden border-2 transition-all p-2 ${selectedImage === img.image_url ? "border-[#042540] bg-white shadow-md" : "border-transparent bg-gray-50 hover:bg-white"}`}
              >
                <img src={img.image_url} className="w-full h-full object-contain" alt="thumbnail" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: BUYING PANEL */}
        <div className="lg:w-[50%] space-y-8 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <span className="text-accentPink font-bold uppercase tracking-[0.4em] text-[11px]">{product.brand?.name}</span>
               <Share2 size={20} className="text-gray-300 cursor-pointer hover:text-black transition-colors" />
            </div>

            <h1 className="text-5xl font-playfair font-black text-[#042540] tracking-tight leading-[1.1]">
              {product.name}
            </h1>

            <div className="flex items-center gap-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.round(liveAverageRating) ? "#FFD700" : "none"} 
                    className={i < Math.round(liveAverageRating) ? "text-[#FFD700]" : "text-gray-200"}
                  />
                ))}
              </div>
              <button 
                onClick={scrollToReviews}
                className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#042540] transition-colors underline underline-offset-4"
              >
                {liveReviewCount} Verified Reviews
              </button>
              <span className="h-4 w-[1px] bg-gray-200"></span>
              <span className="text-[11px] font-bold text-green-600 flex items-center gap-1 uppercase tracking-widest">
                <CheckCircle2 size={14}/> In Stock
              </span>
            </div>

            {/* Price Display with Compare At Price */}
            <div className="flex items-center gap-4 py-6 border-y border-gray-100">
               <div className="flex flex-col">
                  {selectedVariant?.compare_at_price && Number(selectedVariant.compare_at_price) > Number(selectedVariant.price) && (
                    <span className="text-sm text-gray-300 line-through font-medium mb-1">
                      Ksh {Number(selectedVariant.compare_at_price).toLocaleString()}
                    </span>
                  )}
                  <span className="text-4xl font-playfair font-black text-[#042540]">
                    Ksh {Number(selectedVariant?.price || 0).toLocaleString()}
                  </span>
               </div>
               {selectedVariant?.compare_at_price && Number(selectedVariant.compare_at_price) > Number(selectedVariant.price) && (
                 <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-red-100">
                    Save {Math.round(((selectedVariant.compare_at_price - selectedVariant.price) / selectedVariant.compare_at_price) * 100)}%
                 </span>
               )}
            </div>

            {/* Product Metadata Info Grid */}
            <div className="grid grid-cols-2 gap-y-6 pt-2">
               <div className="space-y-1">
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Brand</p>
                 <p className="font-semibold text-[#042540]">{product.brand?.name || "Premium Scent"}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Fragrance Type</p>
                 <p className="font-semibold text-[#042540]">{product.product_type?.name || "Eau De Parfum"}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Category</p>
                 <p className="font-semibold text-[#042540] capitalize">{product.categories?.map(c => c.name).join(", ") || "Unisex"}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Availability</p>
                 <p className="font-semibold text-gray-800">Delivery in 24-48 Hours</p>
               </div>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Select Bottle Size</p>
              <div className="flex flex-wrap gap-3">
                {product.variants?.map((v) => (
                  <button 
                    key={v.id} 
                    onClick={() => setSelectedVariant(v)}
                    className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${selectedVariant?.id === v.id ? "bg-[#042540] text-white shadow-xl scale-105" : "bg-white text-gray-400 border border-gray-100 hover:border-gray-900"}`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            {/* REFINED BUTTONS SECTION */}
            <div className="flex flex-col gap-4 pt-6">
              <div className="flex gap-4 h-16">
                <div className="flex items-center bg-gray-50 rounded-2xl p-2 px-4 border border-gray-100 shadow-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-accentPink transition-colors"><Minus size={18}/></button>
                  <span className="w-12 text-center font-bold text-xl text-[#042540]">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-accentPink transition-colors"><Plus size={18}/></button>
                </div>
                
                <button 
                  onClick={() => addToCart({...product, selectedVariant, quantity})} 
                  className="flex-[2] bg-[#042540] text-white rounded-2xl font-black uppercase tracking-[0.15em] text-sm hover:bg-[#0a365c] shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <ShoppingCart size={20} strokeWidth={2.5} /> Add to Cart
                </button>
              </div>

              <button 
                onClick={handleWhatsAppCheckout}
                className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-3 hover:bg-[#1ebe57] shadow-xl shadow-green-100 transition-all active:scale-[0.98]"
              >
                <Smartphone size={20} strokeWidth={2.5} /> Order on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FRAGRANCE NOTES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-[#042540] rounded-[3rem] p-16 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accentPink/5 rounded-full blur-[80px]"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
            {[
              { icon: Wind, label: "Top Notes", value: product.top_notes },
              { icon: Droplets, label: "Heart Notes", value: product.heart_notes },
              { icon: Leaf, label: "Base Notes", value: product.base_notes }
            ].map((note, i) => (
              <div key={i} className="space-y-4">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                  <note.icon size={32} className="text-accentPink" />
                </div>
                <h4 className="font-playfair text-2xl tracking-tight">{note.label}</h4>
                <p className="text-gray-400 text-sm font-medium leading-relaxed italic">"{note.value || "Exquisite Blend"}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TABS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24" ref={reviewsRef}>
        <div className="flex border-b border-gray-100 gap-12 mb-12 overflow-x-auto no-scrollbar">
          {["description", "shipping", "reviews"].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`pb-5 text-[11px] font-bold uppercase tracking-[0.3em] whitespace-nowrap transition-all relative ${activeTab === tab ? "text-[#042540] after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-[#042540]" : "text-gray-300 hover:text-gray-500"}`}
            >
              {tab} {tab === "reviews" && `(${liveReviewCount})`}
            </button>
          ))}
        </div>

        <div className="min-h-[250px]">
          {activeTab === "description" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="font-playfair text-4xl text-[#042540] mb-8 leading-tight">The Experience</h3>
              <p className="text-gray-500 style={{ whiteSpace: 'pre-wrap' }} leading-loose text-lg max-w-5xl">{product.description}</p>
            </div>
          )}
          
          {activeTab === "shipping" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
               <div className="flex gap-6 items-center bg-[#fdfdfd] p-10 rounded-[2rem] border border-gray-100">
                  <div className="p-4 bg-gray-50 rounded-2xl"><Truck size={36} className="text-[#042540]" /></div>
                  <div>
                    <h5 className="font-bold text-[#042540] text-lg mb-1">Local Delivery</h5>
                    <p className="text-sm text-gray-500 font-medium">Fast delivery within Nairobi (24hrs) and nationwide (48hrs).</p>
                  </div>
               </div>
               <div className="flex gap-6 items-center bg-[#fdfdfd] p-10 rounded-[2rem] border border-gray-100">
                  <div className="p-4 bg-green-50 rounded-2xl"><VerifiedIcon size={36} className="text-green-600" /></div>
                  <div>
                    <h5 className="font-bold text-[#042540] text-lg mb-1">100% Original</h5>
                    <p className="text-sm text-gray-500 font-medium">Money-back guarantee on authenticity of all imports.</p>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {reviewsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#042540] rounded-full flex items-center justify-center font-bold text-white uppercase">
                            {rev.guest_name?.[0] || 'V'}
                          </div>
                          <div>
                            <p className="font-bold text-[#042540] text-lg">{rev.guest_name || "Valued Customer"}</p>
                            {rev.is_verified && (
                              <span className="flex items-center gap-1.5 text-[10px] text-green-600 font-black uppercase tracking-widest mt-1">
                                <VerifiedIcon size={12} fill="currentColor" /> Verified Purchase
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < rev.rating ? "#FFD700" : "none"} className={i < rev.rating ? "text-[#FFD700]" : "text-gray-200"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-500 text-lg italic leading-relaxed font-medium">"{rev.comment}"</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(rev.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                   <MessageSquare className="mx-auto text-gray-300 mb-6" size={48} />
                   <h4 className="font-playfair text-2xl text-[#042540]">No impressions yet</h4>
                   <p className="text-gray-500 font-medium">Be the first to share your journey with this fragrance.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40">
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-4">
               <h2 className="text-5xl font-playfair font-black text-[#042540] tracking-tight">Complete Your Collection</h2>
               <p className="text-gray-400 font-medium tracking-wide">Handpicked selection of scents you'll likely fall in love with.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <Link to={`/product/${p.slug}`} key={p.id} className="group block">
                <div className="aspect-[4/5] bg-[#f9f9f9] rounded-[2rem] overflow-hidden border border-gray-100 mb-6 p-10 relative">
                  <img src={p.images?.[0]?.image_url} alt={p.name} className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110" />
                </div>
                <h4 className="font-playfair text-xl text-[#042540] group-hover:text-accentPink transition-colors mb-2 truncate">{p.name}</h4>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-3">{p.brand?.name}</p>
                <p className="font-bold text-gray-900">Ksh {Number(p.variants?.[0]?.price || 0).toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;