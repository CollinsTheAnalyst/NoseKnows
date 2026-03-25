import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "../components/card/card.jsx";
import { useCart } from "../context/cartcontext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Shop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get("category");
  const searchQuery = queryParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Filter States ---
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]); // EDP, EDT, etc.
  const [priceRange, setPriceRange] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/products/`)
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

  useEffect(() => {
    let tempProducts = [...products];

    // 1. URL Category Filter
    if (categoryFilter) {
      tempProducts = tempProducts.filter((p) =>
        p.categories.some((c) => c.name.toLowerCase() === categoryFilter.toLowerCase())
      );
    }

    // 2. URL Search Filter
    if (searchQuery.trim() !== "") {
      tempProducts = tempProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 3. Sidebar: Brand Filter
    if (selectedBrands.length > 0) {
      tempProducts = tempProducts.filter((p) => selectedBrands.includes(p.brand?.name));
    }

    // 4. Sidebar: Perfume Type Filter
    if (selectedTypes.length > 0) {
      tempProducts = tempProducts.filter((p) => selectedTypes.includes(p.product_type?.name));
    }

    // 5. Sidebar: Tag Filter
    if (selectedTags.length > 0) {
      tempProducts = tempProducts.filter((p) =>
        p.tags?.some((t) => selectedTags.includes(t.name))
      );
    }

    // 6. Sidebar: Price Range Filter
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      tempProducts = tempProducts.filter((p) =>
        p.variants.some((v) => {
          const pVal = parseFloat(v.price);
          return pVal >= min && (max !== 0 ? pVal <= max : true);
        })
      );
    }

    // 7. Sidebar: Availability
    if (inStockOnly) {
      tempProducts = tempProducts.filter((p) => p.in_stock);
    }

    setFilteredProducts(tempProducts);
  }, [categoryFilter, searchQuery, products, selectedTags, selectedBrands, selectedTypes, priceRange, inStockOnly]);

  const clearFilter = (filterToClear) => {
    let newPath = "/shop";
    if (filterToClear === "category" && searchQuery) {
      newPath = `/shop?search=${searchQuery}`;
    } else if (filterToClear === "search" && categoryFilter) {
      newPath = `/shop?category=${categoryFilter}`;
    }
    navigate(newPath);
  };

  const toggleFilter = (list, setList, item) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  if (loading) return <p className="text-center py-16">Loading products...</p>;
  if (error) return <p className="text-center py-16 text-red-500">{error}</p>;

  const availableBrands = [...new Set(products.map((p) => p.brand?.name).filter(Boolean))];
  const availableTypes = [...new Set(products.map((p) => p.product_type?.name).filter(Boolean))];

  return (
    <section className="w-full">
      <div className="bg-[#fff3f6] mt-36 pt-8 pb-6 mb-8 border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <nav className="flex justify-start mb-8 text-sm font-montserrat text-gray-500">
            <span className="hover:text-accentPink cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span className="mx-2">/</span>
            <span className={`cursor-pointer ${!categoryFilter ? 'text-accentPink font-semibold' : 'hover:text-accentPink'}`} onClick={() => navigate('/shop')}>Shop</span>
            {categoryFilter && (
              <><span className="mx-2">/</span><span className="text-accentPink font-semibold capitalize">{categoryFilter}</span></>
            )}
          </nav>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-[#00306b] mb-4">
              {categoryFilter ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Collection` : searchQuery ? `Search: "${searchQuery}"` : "Our Collection"}
            </h2>
            <div className="w-24 h-1 bg-accentPink mx-auto rounded-full opacity-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-24 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR */}
        <aside className="w-full lg:w-1/4 flex-shrink-0">
          <div className="sticky top-28 space-y-8 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center border-b pb-4">
               <h3 className="text-xl font-bold text-[#00306b]">Filters</h3>
               <button onClick={() => {setPriceRange(null); setSelectedBrands([]); setSelectedTags([]); setSelectedTypes([]); setInStockOnly(false)}} className="text-xs text-accentPink hover:underline transition-all">Reset All</button>
            </div>

            {/* Availability */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="w-4 h-4 accent-accentPink" />
              <span className="font-semibold text-gray-700 group-hover:text-accentPink transition-colors">In Stock Only</span>
            </label>

            {/* Tags */}
            <div>
              <p className="font-bold text-gray-800 mb-3">Featured</p>
              <div className="flex flex-wrap gap-2">
                {["Best Seller", "New Arrival"].map(tag => (
                  <button key={tag} onClick={() => toggleFilter(selectedTags, setSelectedTags, tag)} className={`px-3 py-1 rounded-full border text-xs transition-all ${selectedTags.includes(tag) ? 'bg-accentPink text-white border-accentPink shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-accentPink'}`}>{tag}</button>
                ))}
              </div>
            </div>

            {/* Perfume Type (EDP, EDT, etc.) */}
            <div>
              <p className="font-bold text-gray-800 mb-3">Concentration</p>
              <div className="space-y-2">
                {availableTypes.map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 group">
                    <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => toggleFilter(selectedTypes, setSelectedTypes, type)} className="accent-accentPink" />
                    <span className="group-hover:text-accentPink transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <p className="font-bold text-gray-800 mb-3">Price (Ksh)</p>
              <div className="space-y-2">
                {[
                  { label: "Under 1,000", val: "0-1000" },
                  { label: "1,000 - 2,500", val: "1000-2500" },
                  { label: "2,500 - 5,000", val: "2500-5000" },
                  { label: "Over 5,000", val: "5000-0" }
                ].map(r => (
                  <label key={r.val} className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 group">
                    <input type="radio" name="price" checked={priceRange === r.val} onChange={() => setPriceRange(r.val)} className="accent-accentPink" />
                    <span className="group-hover:text-accentPink transition-colors">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <p className="font-bold text-gray-800 mb-3">Brand</p>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {availableBrands.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 group">
                    <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleFilter(selectedBrands, setSelectedBrands, brand)} className="accent-accentPink" />
                    <span className="group-hover:text-accentPink transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  slug={product.slug}
                  title={product.name}
                  // We can pass scent notes and type to the card if needed
                  type={product.product_type?.name} 
                  priceRange={
                    Array.isArray(product.variants) && product.variants.length > 0
                      ? product.variants.length > 1
                        ? `${product.variants[0].price} - ${product.variants[product.variants.length - 1].price}`
                        : `${product.variants[0].price}`
                      : "N/A"
                  }
                  image={product.images?.[0]?.image_url}
                  onCartClick={() => addToCart(product)}
                  onClick={() => navigate(`/product/${product.slug}`)}
                  className="hover:shadow-xl transition-shadow duration-300"
                />
              ))
            ) : (
              <p className="col-span-full text-center py-20 text-gray-400 italic font-montserrat">
                No fragrances found matching your selection.
              </p>
            )}
          </div>
        </main>
      </div>
    </section>
  );
};

export default Shop;