import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "../components/card/card.jsx";
import { useCart } from "../context/cartcontext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Shop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart(); // Cart context

  // Extract query params
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get("category");
  const searchQuery = queryParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:8000/frontend/products/")
      .then((res) => res.json())
      .then((data) => {
        const allProducts = data.results || [];
        setProducts(allProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setError("Failed to load products. Please try again.");
        setLoading(false);
      });
  }, []);

  // Apply filters (category + search)
  useEffect(() => {
    let tempProducts = [...products];

    // Category filter
    if (categoryFilter && tempProducts.length > 0) {
      tempProducts = tempProducts.filter((p) =>
        p.categories.some(
          (c) => c.name.toLowerCase() === categoryFilter.toLowerCase()
        )
      );
    }

    // Search filter
    if (searchQuery.trim() !== "") {
      tempProducts = tempProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(tempProducts);
  }, [categoryFilter, searchQuery, products]);

  if (loading)
    return <p className="text-center py-16">Loading products...</p>;
  if (error)
    return <p className="text-center py-16 text-red-500">{error}</p>;

  // Function to navigate and clear a single filter
  const clearFilter = (filterToClear) => {
    let newPath = "/shop";
    // Check if the other filter should be preserved
    if (filterToClear === "category" && searchQuery) {
      newPath = `/shop?search=${searchQuery}`;
    } else if (filterToClear === "search" && categoryFilter) {
      newPath = `/shop?category=${categoryFilter}`;
    }
    navigate(newPath);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-24">
      {/* Page Heading */}
      <h2 className="text-3xl font-playfair font-bold mb-4 text-textDark text-center sm:text-left">
        {categoryFilter
          ? `Shop ${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Collection`
          : searchQuery
          ? `Search results for "${searchQuery}"`
          : "Shop Our Collection"}
      </h2>

      {/* Filter badge */}
      {(categoryFilter || searchQuery) && (
        <div className="flex justify-start mb-10">
          {categoryFilter && (
            <div className="inline-flex items-center bg-purple-100 text-pink-700 font-medium px-4 py-2 rounded-full shadow-sm text-sm mr-3">
              <span className="capitalize">{categoryFilter}</span>
              <button
                onClick={() => clearFilter("category")} 
                className="ml-3 text-pink-600 hover:text-pink-800 font-bold"
                aria-label="Clear filter"
              >
                ✕
              </button>
            </div>
          )}
          {searchQuery && (
            <div className="inline-flex items-center bg-yellow-100 text-yellow-800 font-medium px-4 py-2 rounded-full shadow-sm text-sm">
              <span>Search: {searchQuery}</span>
              <button
                onClick={() => clearFilter("search")} 
                className="ml-3 text-yellow-700 hover:text-yellow-900 font-bold"
                aria-label="Clear search"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const priceRange =
              Array.isArray(product.variants) && product.variants.length > 0
                ? product.variants.length > 1
                  ? `${product.variants[0].price} - ${product.variants[product.variants.length - 1].price}`
                  : `${product.variants[0].price}`
                : "N/A";

            return (
              <Card
                key={product.id}
                slug={product.slug}
                title={product.name}
                priceRange={priceRange}
                image={product.images?.[0]?.image_url}
                onWhatsAppClick={() => console.log(`WhatsApp ${product.name}`)}
                onWishlistClick={() => console.log(`Wishlist ${product.name}`)}
                onCartClick={() => addToCart(product)} // Add to cart
                onClick={() => navigate(`/product/${product.slug}`)}
                className="cursor-pointer"
              />
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        )}
      </div>
    </section>
  );
};

export default Shop;