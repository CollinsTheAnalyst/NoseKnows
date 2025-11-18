// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/hero/HeroSection.jsx"; // Case fixed
import HeroFilter from "../components/filters/herofilter.jsx"; // Case fixed
import Card from "../components/card/card.jsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "../context/cartcontext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"; // Dynamic API URL

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // 🔹 States
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingFaqs, setLoadingFaqs] = useState(true);

  // 🔹 Fetch products, brands, FAQs (FINAL CORRECTED PRODUCTION URLs)
  useEffect(() => {
    // Products
    fetch(`${API_URL}/api/products/`) 
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.results || []);
        setLoadingProducts(false);
      })
      .catch((err) => console.error("Failed to load products:", err));

    // Brands
    fetch(`${API_URL}/api/brands/`) 
      .then((res) => res.json())
      .then((data) => {
        setBrands(data.results || []);
        setLoadingBrands(false);
      })
      .catch((err) => console.error("Failed to load brands:", err));

    // FAQs
    fetch(`${API_URL}/api/faqs/?featured=true`) 
      .then((res) => res.json())
      .then((data) => {
        setFaqs(data.results || data);
        setLoadingFaqs(false);
      })
      .catch((err) => {
        console.error("Failed to load FAQs:", err);
        setLoadingFaqs(false);
      });
  }, []);

  // 🔹 Product Section Renderer
  const renderProductSection = (
    title,
    productList,
    bgColor = "bg-gradient-to-r from-gray-50 to-pink-50"
  ) => (
    <>
      <div className="text-center mb-4">
        <h2 className="text-4xl sm:text-5xl font-['GreatVibes',serif] text-[#042540]">
          {title}
        </h2>
      </div>

      <section className={`${bgColor} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList.map((product) => {
              const priceRange =
                Array.isArray(product.variants) && product.variants.length > 0
                  ? product.variants.length > 1
                    ? `${product.variants[0]?.price} - ${
                        product.variants[product.variants.length - 1]?.price
                      }`
                    : `${product.variants[0]?.price}`
                  : "N/A";

              return (
                <Card
                  key={product.id}
                  image={product.images[0]?.image_url}
                  title={product.name}
                  slug={product.slug}
                  priceRange={priceRange}
                  showActions={true}
                  imageClassName="h-72 object-contain"
                  onCartClick={() => addToCart(product)} 
                  onWhatsAppClick={() =>
                    console.log(`WhatsApp clicked for ${product.name}`)
                  }
                  onWishlistClick={() =>
                    console.log(`Wishlist clicked for ${product.name}`)
                  }
                  onClick={() => navigate(`/product/${product.slug}`)}
                  className="cursor-pointer"
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );

  // 🔹 Toggle FAQ open/close
  const toggleFAQ = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <HeroSection />
      <HeroFilter />

      {/* ✅ Product Sections */}
      {loadingProducts ? (
        <p className="text-center py-16">Loading products...</p>
      ) : (
        <>
          {renderProductSection(
            "Men",
            products.filter((p) =>
              p.categories.some((c) => c.name.toLowerCase() === "men")
            ),
            "bg-gradient-to-r from-gray-50 to-pink-50"
          )}
          {renderProductSection(
            "Ladies",
            products.filter((p) =>
              p.categories.some((c) => c.name.toLowerCase() === "women")
            ),
            "bg-gradient-to-r from-pink-50 to-gray-50"
          )}
          {renderProductSection(
            "Unisex",
            products.filter((p) =>
              p.categories.some((c) => c.name.toLowerCase() === "unisex")
            ),
            "bg-gradient-to-r from-gray-50 to-pink-50"
          )}
        </>
      )}

      {/* ✅ Featured Brands */}
      <div className="text-center mb-4">
        <h2 className="text-4xl sm:text-5xl font-['GreatVibes',serif] text-[#042540]">
          Featured Brands
        </h2>
      </div>
      <section className="bg-pink-50 py-12">
        {loadingBrands ? (
          <p className="text-center">Loading brands...</p>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
            {brands.map((brand) => (
              <img
                key={brand.id}
                src={brand.image}
                alt={brand.name}
                className="w-full h-24 object-contain"
              />
            ))}
          </div>
        )}
      </section>

      {/* ✅ FAQs Section */}
      <div className="text-center mb-4">
        <h2 className="text-4xl sm:text-5xl font-['GreatVibes',serif] text-[#042540]">
          Frequently Asked Questions
        </h2>
      </div>

      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          {loadingFaqs ? (
            <p className="text-center col-span-2">Loading FAQs...</p>
          ) : faqs.length === 0 ? (
            <p className="text-center col-span-2 text-gray-500">
              No FAQs available at the moment.
            </p>
          ) : (
            faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 transition hover:shadow-md"
              >
                <button
                  className="w-full flex justify-between items-center text-left"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <span className="text-lg font-medium text-gray-800">
                    {faq.question}
                  </span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;