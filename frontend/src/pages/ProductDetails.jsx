// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    // Fetch product by slug
    fetch(`http://localhost:8000/frontend/products/${slug}/`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.images?.[0]?.image_url || "");
      })
      .catch((err) => console.error("Failed to fetch product:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="text-center py-16">Loading...</p>;
  if (!product) return <p className="text-center py-16 text-red-500">Product not found</p>;

  return (
    <div className="min-h-screen space-y-12">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-sm text-gray-500">
        <Link to="/" className="hover:underline">Home</Link> /{" "}
        <Link to="/brands" className="hover:underline">Brands</Link> /{" "}
        {product.brand?.name} / {product.name}
      </div>

      {/* Product Header */}
      <section className="bg-gradient-to-r from-gray-50 to-pink-50 py-16 flex flex-col items-center text-center mt-6">
        <img
          src={product.images?.[0]?.image_url}
          alt={product.name}
          className="w-40 h-40 object-contain rounded-xl shadow-md mb-6"
        />
        <h1 className="text-5xl font-bold text-[#042540] mb-4">{product.name}</h1>
        {product.brand?.name && (
          <p className="text-gray-600 text-lg mb-4">Brand: {product.brand.name}</p>
        )}
        {product.description && (
          <p className="max-w-2xl text-gray-600">{product.description}</p>
        )}
      </section>

      {/* Image Gallery + Add to Cart */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Main Image */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={selectedImage}
            alt={product.name}
            className="rounded-xl shadow-md object-contain max-h-[500px] w-full lg:w-auto"
          />
        </div>

        {/* Thumbnails */}
        <div className="flex lg:flex-col gap-2">
          {product.images?.map((img, idx) => (
            <img
              key={idx}
              src={img.image_url}
              alt={`${product.name} ${idx}`}
              className={`w-16 h-16 object-contain rounded cursor-pointer border ${
                selectedImage === img.image_url ? "border-[#7B6IFF]" : "border-gray-200"
              }`}
              onClick={() => setSelectedImage(img.image_url)}
            />
          ))}
        </div>

        {/* Add to Cart / Product Table */}
        <div className="flex-1 flex flex-col justify-start lg:justify-center space-y-6">
          {product.variants?.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
              <h2 className="text-2xl font-semibold text-[#042540]">Available Options</h2>
              
              {/* Product Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-gray-700">Size</th>
                      <th className="px-4 py-2 text-gray-700">Price (Ksh)</th>
                      <th className="px-4 py-2 text-gray-700">Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((variant) => (
                      <tr key={variant.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{variant.size}</td>
                        <td className="px-4 py-2">{variant.price}</td>
                        <td className="px-4 py-2">{variant.quantity_available}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add to Cart Button */}
              <button className="w-full mt-4 bg-[#7B6IFF] text-white py-3 rounded hover:bg-[#7B6IFF]/90 font-semibold">
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Scent Notes / Description */}
      {product.scent_notes && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white py-12 rounded-xl shadow-md">
          <h2 className="text-3xl font-semibold text-[#042540] mb-4">Scent Notes</h2>
          <p className="text-gray-600 whitespace-pre-line">{product.scent_notes}</p>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
