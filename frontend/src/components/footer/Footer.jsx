// src/components/Footer.jsx
import React from "react";
import Button from "../button/button.jsx";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#042540] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-3xl font-playfair font-bold mb-4 text-[#FDECEF]">NoseKnows</h2>
          <p className="text-gray-300 text-sm">
            Explore luxurious perfumes crafted for every mood and occasion.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-2 md:items-center">
          <a href="/" className="hover:text-[#7B6IFF] transition-colors duration-300">Home</a>
          <a href="/shop" className="hover:text-[#7B6IFF] transition-colors duration-300">Shop</a>
          <a href="/about" className="hover:text-[#7B6IFF] transition-colors duration-300">About</a>
          <a href="/contact-us" className="hover:text-[#7B6IFF] transition-colors duration-300">Contact</a>
          <a href="/blog" className="hover:text-[#7B6IFF] transition-colors duration-300">Blog</a>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col space-y-4">
          <span className="font-semibold text-[#FDECEF]">Subscribe to our newsletter</span>
          <div className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Your email"
              className="p-2 rounded-l-lg border border-gray-300 focus:outline-none flex-1 text-gray-800"
            />
            <Button className="rounded-r-lg bg-[#7B6IFF] text-white hover:bg-[#5e52d4] px-4">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Social Icons */}
      <div className="mt-10 border-t border-gray-600 pt-6 flex justify-center space-x-6 text-gray-400">
        <a href="#" className="hover:text-[#7B6IFF] transition-colors duration-300"><FaFacebookF /></a>
        <a href="#" className="hover:text-[#7B6IFF] transition-colors duration-300"><FaTwitter /></a>
        <a href="#" className="hover:text-[#7B6IFF] transition-colors duration-300"><FaInstagram /></a>
        <a href="#" className="hover:text-[#7B6IFF] transition-colors duration-300"><FaLinkedinIn /></a>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} NoseKnows. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
