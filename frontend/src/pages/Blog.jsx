import React from "react";

const blogPosts = [
  {
    id: 1,
    title: "The Art of Perfume Layering",
    excerpt: "Learn how to combine fragrances to create your signature scent with our expert tips.",
    image: "https://via.placeholder.com/400x300?text=Perfume+Layering",
  },
  {
    id: 2,
    title: "Top 5 Summer Scents",
    excerpt: "Discover refreshing fragrances perfect for the sunny season, curated by NoseKnows.",
    image: "https://via.placeholder.com/400x300?text=Summer+Scents",
  },
  {
    id: 3,
    title: "Perfume Tips for Special Occasions",
    excerpt: "Make your events memorable with the right fragrance selection.",
    image: "https://via.placeholder.com/400x300?text=Special+Occasions",
  },
  {
    id: 4,
    title: "How to Choose Your Signature Scent",
    excerpt: "Step-by-step guidance on finding the perfume that truly represents you.",
    image: "https://via.placeholder.com/400x300?text=Signature+Scent",
  },
  {
    id: 5,
    title: "Behind the Scenes: Perfume Creation",
    excerpt: "A look into how premium fragrances are crafted from concept to bottle.",
    image: "https://via.placeholder.com/400x300?text=Perfume+Creation",
  },
  {
    id: 6,
    title: "Fragrance Trends in 2025",
    excerpt: "Stay ahead with the upcoming perfume trends for the new year.",
    image: "https://via.placeholder.com/400x300?text=Trends+2025",
  },
];

const Blog = () => {
  return (
    <section className="bg-[#FFF7F2] pt-[140px] pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
        
        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl font-playfair font-bold text-[#042540]">
            Our Blog
          </h1>
          <div className="mx-auto w-24 h-1 bg-[#F9A826] rounded-full"></div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition hover:shadow-xl"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col flex-1 text-left">
                <h2 className="text-xl font-playfair font-bold text-[#042540] mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-700 font-montserrat flex-1 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <button className="mt-auto px-4 py-2 bg-[#F9A826] text-[#042540] font-semibold rounded-lg hover:bg-[#fcbf60] transition">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
