// src/components/navigation/TopNav.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { useCart } from "../../context/cartcontext.jsx"; // Cart + Wishlist context


const TopNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // ❌ Removed: const [cartOpen, setCartOpen] = useState(false);
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

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      if (menuOpen) setMenuOpen(false);
    }
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1) * Number(item.price || 0),
    0
  );

  return (
    <nav className="bg-[#00306b] text-white fixed w-full top-0 z-50 shadow-lg">
      {/* Top Utility Bar */}
      <div className="py-2 px-6 flex justify-between items-center text-sm">
        <div></div>
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

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* ❌ REMOVED: Logo */}
        <div className="hidden lg:block w-40"></div> 

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="relative w-full max-w-xl order-3 lg:order-none lg:flex-1 lg:max-w-none lg:mx-auto" 
        >
          <input
            type="text"
            placeholder="Search for perfumes..."
            className="pl-5 pr-10 py-3 rounded-full bg-white text-gray-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            size={20}
            className="absolute right-4 top-3.5 text-gray-700 cursor-pointer"
            onClick={handleSearch}
          />
        </form>

        {/* Desktop Links + Icons (Moved to the far right) */}
        <div className="hidden lg:flex items-center space-x-8 pl-4">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              <Link
                to={link.path}
                className={`text-[15px] font-montserrat transition duration-300 ${
                  isActive(link.path)
                    ? "text-yellow-400 font-semibold"
                    : "text-white hover:text-yellow-400"
                }`}
              >
                {link.name}
              </Link>
              <span
                className={`absolute -bottom-1 left-0 w-full h-[3px] bg-yellow-400 rounded-full origin-left transition-transform duration-300 ${
                  isActive(link.path)
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></span>
            </div>
          ))}

          {/* Wishlist + Cart */}
          <div className="flex items-center space-x-4 pl-2 relative">
            {/* Wishlist */}
            <button
              onClick={() => navigate("/wishlist")}
              className="hover:text-yellow-400 transition relative"
            >
              <Heart size={22} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-[#00306b] text-xs font-bold px-1.5 rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <div className="relative">
              <button
                // ✅ FIX: Navigate directly to the Cart Page
                onClick={() => navigate("/checkout")} 
                className="hover:text-yellow-400 transition relative"
              >
                <ShoppingCart size={22} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-[#00306b] text-xs font-bold px-1.5 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </button>
              {/* Mini cart dropdown logic removed as per request */}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown (No change needed here as it was already navigating to /checkout) */}
      {menuOpen && (
        <div className="lg:hidden bg-[#00306b]">
          <div className="flex flex-col items-center space-y-3 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-base transition ${
                  isActive(link.path)
                    ? "text-yellow-400 font-semibold"
                    : "text-white hover:text-yellow-400"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative px-4 w-full">
              <input
                type="text"
                placeholder="Search perfumes..."
                className="pl-4 pr-10 py-2 rounded-full bg-white text-gray-800 text-sm focus:outline-none w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                size={18}
                className="absolute right-7 top-3 text-gray-700 cursor-pointer"
                onClick={handleSearch}
              />
            </form>

            {/* Mobile Icons */}
            <div className="flex items-center justify-center gap-6 pt-3">
              <button
                onClick={() => navigate("/wishlist")}
                className="relative"
              >
                <Heart size={22} className="hover:text-yellow-400 transition" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-[#00306b] text-xs font-bold px-1.5 rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="relative"
              >
                <ShoppingCart size={22} className="hover:text-yellow-400 transition" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-[#00306b] text-xs font-bold px-1.5 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNav;