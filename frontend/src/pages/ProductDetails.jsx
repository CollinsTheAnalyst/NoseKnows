// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingCart, MessageCircle } from "lucide-react";
import CartModal from "../components/cart/cartmodal"; 
import { useCart } from "../context/cartcontext.jsx"; // ✅ import context

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);

  const { 
    addToCart, 
    openCart, 
    wishlistItems, 
    addToWishlist, 
    removeFromWishlist 
  } = useCart();

  useEffect(() => {
    fetch("http://localhost:8000/frontend/products/")
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.results.find((p) => p.slug === slug);
        setProduct(foundProduct);
        setSelectedImage(foundProduct?.images?.[0]?.image_url || "");
        setSelectedVariant(foundProduct?.variants?.[0] || null);

        const related = data.results.filter(
          (p) =>
            p.id !== foundProduct?.id &&
            p.brand?.id === foundProduct?.brand?.id
        );
        setRelatedProducts(related);
      })
      .catch((err) => console.error("Failed to fetch product:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="text-center py-16">Loading...</p>;
  if (!product) return <p className="text-center py-16 text-red-500">Product not found</p>;

  // ✅ Check if product is in wishlist
  const isInWishlist = wishlistItems.some(item => item.id === slug);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select a size first.");
      return;
    }

    const productToAdd = {
      ...product,
      selectedVariant,
      quantity,
      image: selectedImage,
    };

    addToCart({
      id: slug,
      name: product.name,
      price: selectedVariant?.price || product.price,
      image: selectedImage,
      quantity,
      selectedVariant,
    });

    openCart();
    setShowCartModal(true);
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(slug);
    } else {
      addToWishlist({
        id: slug,
        name: product.name,
        price: selectedVariant?.price || product.price,
        image: selectedImage,
        quantity: 1,
        selectedVariant,
      });
    }
  };

  return (
    <div className="min-h-screen space-y-12 bg-gray-50">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-sm text-gray-500">
        <Link to="/" className="hover:underline">Home</Link> /{" "}
        <Link to="/brands" className="hover:underline">Brands</Link> /{" "}
        {product.brand?.name} / {product.name}
      </nav>

      {/* Product Main Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10">
        {/* Product Images */}
        <div className="flex-1">
          <img
            src={selectedImage}
            alt={product.name}
            className="rounded-xl shadow-md object-contain w-full max-h-[500px]"
          />
          <div className="flex gap-3 mt-4 justify-center">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img.image_url}
                alt={`${product.name} ${idx}`}
                onClick={() => setSelectedImage(img.image_url)}
                className={`w-20 h-20 object-contain rounded-md cursor-pointer border-2 transition ${
                  selectedImage === img.image_url
                    ? "border-[#7B6IFF] scale-105"
                    : "border-gray-200 hover:border-[#7B6IFF]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-start space-y-6 bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#042540]">{product.name}</h1>
          {product.brand?.name && <p className="text-gray-600 text-lg">Brand: {product.brand.name}</p>}

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2 text-[#042540]">Available Sizes</h2>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                      selectedVariant?.id === variant.id
                        ? "bg-[#7B6IFF] text-black border-[#7B6IFF]"
                        : "bg-gray-50 text-gray-800 border-gray-300 hover:border-[#7B6IFF]"
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
              {selectedVariant && (
                <p className="text-xl font-semibold mt-4 text-[#042540]">
                  Ksh {selectedVariant.price.toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
            >-</button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
            >+</button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-[#7B6IFF] text-black py-3 rounded-lg border hover:bg-[#5e52d4] font-semibold transition"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>

            <button
              onClick={handleToggleWishlist}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border font-semibold transition ${
                isInWishlist
                  ? "bg-red-100 border-red-400 text-red-600 hover:bg-red-200"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Heart size={20} fill={isInWishlist ? "red" : "none"} />
              Wishlist
            </button>

            <a
              href={`https://wa.me/254714326105?text=I'm interested in ${product.name} (${selectedVariant?.size}) x${quantity}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg shadow-md hover:bg-green-600 font-semibold transition"
            >
              <MessageCircle size={20} />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Cart Modal */}
      <CartModal
        show={showCartModal}
        onClose={() => setShowCartModal(false)}
        product={{
          ...product,
          selectedVariant,
          quantity,
          price: selectedVariant?.price || product.price,
        }}
      />
    </div>
  );
};

export default ProductDetails;
