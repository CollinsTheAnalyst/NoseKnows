// src/pages/Shop.jsx
import React from "react";
import Card from "../components/card/card.jsx";

// Example products
const products = [
  { id: 1, title: "Rose Delight", description: "Fresh floral scent", price: 45, image: "/images/rose.jpg" },
  { id: 2, title: "Ocean Breeze", description: "Cool aquatic fragrance", price: 50, image: "/images/ocean.jpg" },
  { id: 3, title: "Mystic Oud", description: "Warm woody notes", price: 60, image: "/images/oud.jpg" },
];

const Shop = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-playfair font-bold mb-8 text-center text-textDark">Shop Our Collection</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map(product => (
          <Card
            key={product.id}
            title={product.title}
            description={product.description}
            price={product.price}
            image={product.image}
            onButtonClick={() => console.log(`Added ${product.title} to cart`)}
          />
        ))}
      </div>
    </section>
  );
};

export default Shop;
