// src/components/navigation/TopNav.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, Facebook, Instagram, Twitter, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../../context/cartcontext.jsx";

const TopNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, wishlistItems } = useCart();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Brands", path: "/brands" },
    { name: "Shop", path: "/shop" },
    { name: "Blog", path: "/blog" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      if (menuOpen) setMenuOpen(false);
    }
  };

  return (
    <nav className="bg-[#00306b] text-white fixed w-full top-0 z-50 shadow-lg">
      {/* --- Top Utility Bar (Centered Announcement) --- */}
      <div className="py-2 px-6 grid grid-cols-3 items-center text-sm border-b border-white/10">
        {/* Left Spacing (Empty to keep center balanced) */}
        <div className="hidden lg:block"></div>

        {/* Center: Announcement */}
        <div className="col-span-3 lg:col-span-1 text-center font-montserrat font-medium tracking-wide text-yellow-400 animate-pulse">
          Free Delivery for Orders above Ksh 5,000
        </div>

        {/* Right: Social Icons */}
        <div className="hidden lg:flex items-center justify-end gap-4">
          <a href="#" className="hover:text-yellow-400 transition"><Facebook size={16} /></a>
          <a href="#" className="hover:text-yellow-400 transition"><Instagram size={16} /></a>
          <a href="#" className="hover:text-yellow-400 transition"><Twitter size={16} /></a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1440px] mx-auto px-5 py-5 flex items-center justify-between gap-6">
        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-white order-1">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full max-w-xl flex-1 order-3 lg:order-2">
          <input
            type="text"
            placeholder="Search for perfumes..."
            className="pl-5 pr-12 py-2.5 rounded-full bg-white text-gray-800 text-sm w-full focus:outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-yellow-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="absolute right-4 top-2.5 text-gray-400" />
        </form>

        {/* Desktop Links far right */}
        <div className="hidden lg:flex items-center space-x-6 order-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[14px] uppercase tracking-wider transition ${isActive(link.path) ? "text-yellow-400 font-bold" : "text-white hover:text-yellow-400"}`}
            >
              {link.name}
            </Link>
          ))}

          <div className="flex items-center space-x-4 border-l border-white/20 pl-6">
            <button onClick={() => navigate("/wishlist")} className="relative hover:text-yellow-400 transition">
              <Heart size={20} />
              {wishlistItems.length > 0 && <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 text-[10px] font-bold px-1.5 rounded-full">{wishlistItems.length}</span>}
            </button>
            <button onClick={() => navigate("/checkout")} className="relative hover:text-yellow-400 transition">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 text-[10px] font-bold px-1.5 rounded-full">{cartItems.length}</span>}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;