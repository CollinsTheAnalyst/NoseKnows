// src/components/navigation/TopNav.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  ShoppingCart,
  Heart,
} from "lucide-react";
import logo from "../../assets/noseknows logo.png";

const TopNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#00306b] text-white fixed w-full top-0 z-50 shadow-lg">
      {/* --- Top Utility Bar --- */}
      <div className="py-2 px-6 flex justify-between items-center text-sm">
        {/* Left: Empty (for balance or future message) */}
        <div></div>

        {/* Right: Phone + Social Icons */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-yellow-400" />
            <span>+254 714 326 105</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-yellow-400 transition">
              <Facebook size={18} />
            </a>
            <a href="#" className="hover:text-yellow-400 transition">
              <Instagram size={18} />
            </a>
            <a href="#" className="hover:text-yellow-400 transition">
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* --- Main Navigation Bar --- */}
      <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center space-x-8 -ml-10">
          <img
            src={logo}
            alt="NoseKnows Logo"
            className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Center: Search Bar */}
        <div className="relative w-full max-w-xl order-3 lg:order-none">
          <input
            type="text"
            placeholder="Search for perfumes..."
            className="pl-5 pr-10 py-3 rounded-full bg-white text-gray-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <Search
            size={20}
            className="absolute right-4 top-3.5 text-gray-700 cursor-pointer"
          />
        </div>

        {/* Right: Nav Links + Icons */}
        <div className="hidden lg:flex items-center space-x-8 pl-4">
          {["Home", "Brands", "Shop", "Blog", "Contact Us"].map((item) => (
            <Link
              key={item}
              to={`/${item === "Home" ? "" : item.toLowerCase().replace(" ", "-")}`}
              className="text-white text-[15px] font-montserrat hover:text-yellow-400 transition duration-300"
            >
              {item}
            </Link>
          ))}

          {/* Wishlist + Cart */}
          <div className="flex items-center space-x-4 pl-2">
            <button className="hover:text-yellow-400 transition">
              <Heart size={22} />
            </button>
            <button className="hover:text-yellow-400 transition relative">
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-[#00306b] text-xs font-bold px-1.5 rounded-full">
                2
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- Mobile Dropdown --- */}
      {menuOpen && (
        <div className="lg:hidden bg-[#00306b]">
          <div className="flex flex-col items-center space-y-3 py-4">
            {["Home", "Brands", "Shop", "Blog", "Contact Us"].map((item) => (
              <Link
                key={item}
                to={`/${item === "Home" ? "" : item.toLowerCase().replace(" ", "-")}`}
                className="text-white text-base hover:text-yellow-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}

            {/* Mobile Search */}
            <div className="relative px-4 w-full">
              <input
                type="text"
                placeholder="Search perfumes..."
                className="pl-4 pr-10 py-2 rounded-full bg-white text-gray-800 text-sm focus:outline-none w-full"
              />
              <Search
                size={18}
                className="absolute right-7 top-3 text-gray-700 cursor-pointer"
              />
            </div>

            {/* Wishlist + Cart for Mobile */}
            <div className="flex items-center justify-center gap-6 pt-3">
              <Heart size={22} className="hover:text-yellow-400 transition" />
              <ShoppingCart size={22} className="hover:text-yellow-400 transition" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNav;
