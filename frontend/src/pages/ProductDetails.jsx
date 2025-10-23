import React from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();

  return (
    <section className="bg-[#FDECEF] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-playfair font-bold text-[#042540] mb-6 text-center">
          Product Details
        </h1>

        <div className="bg-[#F5F5F5] rounded-lg shadow-md p-8">
          <p className="text-[#042540] font-montserrat text-lg mb-4">
            Showing details for product ID: <span className="font-semibold text-[#7B6IFF]">{id}</span>
          </p>

          <p className="text-[#042540] font-montserrat text-base">
            {/* Example content */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <button className="mt-6 bg-[#7B6IFF] text-white px-6 py-3 rounded hover:bg-[#7B6IFF]/90 font-montserrat">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
