// src/pages/Shop.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/card/Card.jsx";

const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/frontend/products/")
      .then(res => res.json())
      .then(data => {
        setProducts(data.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load products:", err);
        setError("Failed to load products. Please try again.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center py-16">Loading products...</p>;
  if (error) return <p className="text-center py-16 text-red-500">{error}</p>;

  return (
    <section className="max-w-7xl mx-auto px-4 py-24">
      <h2 className="text-3xl font-playfair font-bold mb-8 text-center text-textDark">
        Shop Our Collection
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.length > 0 ? (
          products.map(product => {
            const priceRange = Array.isArray(product.variants) && product.variants.length > 0
              ? product.variants.length > 1
                ? `${product.variants[0].price} - ${product.variants[product.variants.length - 1].price}`
                : `${product.variants[0].price}`
              : "N/A";

            return (
              <Card
                key={product.id}
                title={product.name}
                priceRange={priceRange}
                image={product.images?.[0]?.image_url}
                onWhatsAppClick={() => console.log(`WhatsApp ${product.name}`)}
                onWishlistClick={() => console.log(`Wishlist ${product.name}`)}
                onCartClick={() => console.log(`Cart ${product.name}`)}
                onClick={() => navigate(`/product/${product.slug}`)} // navigate to product detail
                className="cursor-pointer"
              />
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products available.
          </p>
        )}
      </div>
    </section>
  );
};

export default Shop;
