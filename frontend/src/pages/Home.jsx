// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/hero/HeroSection.jsx";
import HeroFilter from "../components/filters/HeroFilter.jsx";
import Card from "../components/card/Card.jsx";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/frontend/products/")
      .then(res => res.json())
      .then(data => {
        setProducts(data.results || []);
        setLoadingProducts(false);
      })
      .catch(err => console.error("Failed to load products:", err));

    fetch("http://localhost:8000/frontend/brands/")
      .then(res => res.json())
      .then(data => {
        setBrands(data.results || []);
        setLoadingBrands(false);
      })
      .catch(err => console.error("Failed to load brands:", err));
  }, []);

  const renderProductSection = (title, productList, bgColor = "bg-gradient-to-r from-gray-50 to-pink-50") => (
    <>
      {/* Section Title */}
      <div className="text-center mb-4">
        <h2 className="text-4xl sm:text-5xl font-['GreatVibes',serif] text-[#042540]">{title}</h2>
      </div>

      {/* Product Grid */}
      <section className={`${bgColor} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList.map(product => {
              const priceRange =
                Array.isArray(product.variants) && product.variants.length > 0
                  ? product.variants.length > 1
                    ? `${product.variants[0]?.price} - ${product.variants[product.variants.length - 1]?.price}`
                    : `${product.variants[0]?.price}`
                  : "N/A";

              return (
                <Card
                  key={product.id}
                  image={product.images[0]?.image_url}
                  title={product.name}
                  priceRange={priceRange}
                  showActions={true}
                  imageClassName="h-72 object-contain"
                  onCartClick={() => console.log(`${product.name} added to cart`)}
                  onWhatsAppClick={() => console.log(`WhatsApp clicked for ${product.name}`)}
                  onWishlistClick={() => console.log(`Wishlist clicked for ${product.name}`)}
                  onClick={() => navigate(`/product/${product.slug}`)} // Navigate to ProductDetails
                  className="cursor-pointer" // show hover pointer
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );

  return (
    <div className="space-y-12">
      <HeroSection />
      <HeroFilter />

      {loadingProducts ? (
        <p className="text-center py-16">Loading products...</p>
      ) : (
        <>
          {renderProductSection(
            "Men",
            products.filter(p => p.categories.some(c => c.name.toLowerCase() === "men")),
            "bg-gradient-to-r from-gray-50 to-pink-50"
          )}
          {renderProductSection(
            "Ladies",
            products.filter(p => p.categories.some(c => c.name.toLowerCase() === "women")),
            "bg-gradient-to-r from-pink-50 to-gray-50"
          )}
          {renderProductSection(
            "Unisex",
            products.filter(p => p.categories.some(c => c.name.toLowerCase() === "unisex")),
            "bg-gradient-to-r from-gray-50 to-pink-50"
          )}
        </>
      )}

      {/* Featured Brands */}
      <div className="text-center mb-4">
        <h2 className="text-4xl sm:text-5xl font-['GreatVibes',serif] text-[#042540]">Featured Brands</h2>
      </div>
      <section className="bg-pink-50 py-12">
        {loadingBrands ? (
          <p className="text-center">Loading brands...</p>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
            {brands.map(brand => (
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

      {/* FAQs */}
      <div className="text-center mb-4">
        <h2 className="text-4xl sm:text-5xl font-['GreatVibes',serif] text-[#042540]">Frequently Asked Questions</h2>
      </div>
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-center text-gray-500">FAQs will be dynamically loaded from the backend here.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
