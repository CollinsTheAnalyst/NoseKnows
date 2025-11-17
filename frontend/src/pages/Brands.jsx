// src/pages/Brands.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/frontend/brands/") // backend brands endpoint
      .then(res => res.json())
      .then(data => {
        setBrands(data.results); // use the results array
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch brands:", err);
        setError("Failed to load brands. Please try again.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center py-16">Loading brands...</p>;
  if (error) return <p className="text-center py-16 text-red-500">{error}</p>;

  return (
    <div className="space-y-12">
      {/* Page Title */}
      <div className="text-center mt-12">
        <h1 className="text-5xl sm:text-6xl font-['GreatVibes',serif] text-[#042540]">
          Our Brands
        </h1>
      </div>

      {/* Brands Grid */}
      <section className="bg-[#f0f6ff] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {Array.isArray(brands) && brands.map(brand => (
            <div
              key={brand.id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition transform hover:scale-105"
              onClick={() => navigate(`/brands/${brand.slug}`)}
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-24 object-contain mb-2"
              />
              <span className="text-[#042540] font-semibold text-center">{brand.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Brands;
