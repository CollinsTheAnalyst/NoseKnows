import React from "react";
import Button from "../components/button/button.jsx";
import Card from "../components/card/card.jsx";



const Home = () => {
  // Sample featured products
  const featuredProducts = [
    { id: 1, title: "Floral Fantasy", description: "A refreshing mix of jasmine and rose." },
    { id: 2, title: "Woody Wonder", description: "Earthy tones of cedar and sandalwood." },
    { id: 3, title: "Citrus Splash", description: "Zesty citrus aroma for daily freshness." },
  ];

  return (
    <div className="space-y-24">

      {/* Hero Section */}
      <section className="bg-[#E6FIFA] py-32 text-center">
        <h1 className="text-5xl font-playfair font-bold text-[#042540] mb-4">
          Discover Your Signature Scent <span className="text-[#F645C0]">Today</span>
        </h1>
        <p className="text-[#042540] font-montserrat text-lg mb-8 max-w-2xl mx-auto">
          Explore our luxurious perfume collection designed for every mood and moment.
        </p>
        <Button onClick={() => console.log("Shop Collection clicked")}>Shop Collection</Button>
      </section>

      {/* About / Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
        <Card
          title="Premium Ingredients"
          description="We source only the finest raw materials for our fragrances."
        />
        <Card
          title="Custom Blends"
          description="Every scent is carefully blended for a unique experience."
        />
        <Card
          title="Eco-Friendly"
          description="Our packaging and production prioritize sustainability."
        />
      </section>

      {/* Featured Products / Shop Preview */}
      <section className="bg-[#FDECEF] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-playfair font-bold text-[#042540] mb-8 text-center">
            Shop Our Collection
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                title={product.title}
                description={product.description}
                buttonText="Buy Now"
                onButtonClick={() => console.log(`${product.title} clicked`)}
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
