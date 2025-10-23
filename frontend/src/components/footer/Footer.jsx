// src/components/Footer.jsx
import React from "react";
import Button from "../button/button.jsx";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="bg-footerBg text-textDark py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-playfair font-bold mb-4">NoseKnows</h2>
          <p className="text-gray-400 text-sm">
            Explore luxurious perfumes crafted for every mood and occasion.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-2 md:items-center">
          <a href="/" className="hover:text-accentPink transition-colors duration-300">Home</a>
          <a href="/shop" className="hover:text-accentPink transition-colors duration-300">Shop</a>
          <a href="/about" className="hover:text-accentPink transition-colors duration-300">About</a>
          <a href="/contact" className="hover:text-accentPink transition-colors duration-300">Contact</a>
          <a href="/blog" className="hover:text-accentPink transition-colors duration-300">Blog</a>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col space-y-4">
          <span className="font-semibold">Subscribe to our newsletter</span>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="p-2 rounded-l-lg border border-gray-300 focus:outline-none flex-1"
            />
            <Button className="rounded-r-lg bg-accentBlue text-white hover:bg-blue-600">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Social Icons */}
      <div className="mt-10 border-t border-gray-700 pt-6 flex justify-center space-x-6 text-gray-400">
        <a href="#" className="hover:text-accentPink transition-colors duration-300"><FaFacebookF /></a>
        <a href="#" className="hover:text-accentPink transition-colors duration-300"><FaTwitter /></a>
        <a href="#" className="hover:text-accentPink transition-colors duration-300"><FaInstagram /></a>
        <a href="#" className="hover:text-accentPink transition-colors duration-300"><FaLinkedinIn /></a>
      </div>
    </footer>
  );
};

export default Footer;
