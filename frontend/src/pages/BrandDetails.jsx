// src/pages/BrandDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/card/Card.jsx";

const BrandDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [brand, setBrand] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    // Fetch brand by slug
    fetch("http://localhost:8000/frontend/brands/")
      .then((res) => res.json())
      .then((data) => {
        const foundBrand = data.results.find((b) => b.slug === slug);
        setBrand(foundBrand || null);
      })
      .catch((err) => console.error("Failed to load brand:", err));

    // Fetch products for this brand
    fetch("http://localhost:8000/frontend/products/")
      .then((res) => res.json())
      .then((data) => {
        const brandProducts = data.results.filter((p) => p.brand?.slug === slug);
        setAllProducts(brandProducts);
        setDisplayedProducts(brandProducts);

        // Determine available categories
        const categories = new Set();
        brandProducts.forEach((product) => {
          product.categories.forEach((cat) => categories.add(cat.name));
        });
        setAvailableCategories(Array.from(categories));
      })
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="text-center py-16">Loading...</p>;
  if (!brand) return <p className="text-center py-16 text-red-500">Brand not found</p>;

  const handleFilter = (category) => {
    const filtered = allProducts.filter((product) =>
      product.categories.some((c) => c.name === category)
    );
    setDisplayedProducts(filtered);
  };

  return (
    <div className="min-h-screen space-y-12">
      {/* Brand Header */}
      <section className="bg-gradient-to-r from-gray-50 to-pink-50 py-16 flex flex-col items-center text-center mt-24">
        <img
          src={brand.image}
          alt={brand.name}
          className="w-32 h-32 object-contain mb-6"
        />
        <h1 className="text-5xl font-bold text-[#042540] mb-4">{brand.name}</h1>
        {brand.description && (
          <p className="max-w-2xl text-gray-600">{brand.description}</p>
        )}
      </section>

      {/* Category Filter */}
      {availableCategories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            {availableCategories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition"
                onClick={() => handleFilter(category)}
              >
                {category}
              </button>
            ))}
            <button
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
              onClick={() => setDisplayedProducts(allProducts)}
            >
              All
            </button>
          </div>
        </section>
      )}

      {/* Product Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-[#042540] mb-6">Products</h2>
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <Card
                key={product.id}
                image={product.images[0]?.image_url}
                title={product.name}
                priceRange={
                  product.variants.length > 1
                    ? `${product.variants[0]?.price} - ${product.variants[product.variants.length - 1]?.price}`
                    : `${product.variants[0]?.price}`
                }
                showActions={true}
                imageClassName="h-72 object-contain"
                onCartClick={() => console.log(`${product.name} added to cart`)}
                onWhatsAppClick={() => console.log(`WhatsApp clicked for ${product.name}`)}
                onWishlistClick={() => console.log(`Wishlist clicked for ${product.name}`)}
                onClick={() => navigate(`/product/${product.slug}`)}
                className="cursor-pointer"
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-16">No products available for this brand.</p>
        )}
      </section>

      {/* Product Table */}
      {displayedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-[#042540] mb-6">Product Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Size</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price (Ksh)</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Available</th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.map((product) =>
                  product.variants.map((variant) => (
                    <tr key={variant.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-800">{product.name}</td>
                      <td className="px-6 py-4 text-gray-800">{variant.size}</td>
                      <td className="px-6 py-4 text-gray-800">{variant.price}</td>
                      <td className="px-6 py-4 text-gray-800">{variant.quantity_available}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default BrandDetails;
