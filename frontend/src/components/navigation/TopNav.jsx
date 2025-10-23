// src/components/navigation/TopNav.jsx
import React, { useState, useEffect } from "react";
import Button from "../button/button.jsx";
import { Link } from "react-router-dom";

const TopNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Optional: add background shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/90"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        {/* Logo */}
        <Link to="/" className="text-primary text-3xl font-playfair font-bold">
          NoseKnows
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="font-montserrat text-textDark hover:text-accentBlue transition duration-300 relative after:block after:h-0.5 after:w-0 after:bg-accentBlue after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="font-montserrat text-textDark hover:text-accentBlue transition duration-300 relative after:block after:h-0.5 after:w-0 after:bg-accentBlue after:transition-all after:duration-300 hover:after:w-full"
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="font-montserrat text-textDark hover:text-accentBlue transition duration-300 relative after:block after:h-0.5 after:w-0 after:bg-accentBlue after:transition-all after:duration-300 hover:after:w-full"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="font-montserrat text-textDark hover:text-accentBlue transition duration-300 relative after:block after:h-0.5 after:w-0 after:bg-accentBlue after:transition-all after:duration-300 hover:after:w-full"
          >
            Contact
          </Link>

          {/* CTA Button */}
          <Button className="ml-4 bg-accentBlue text-white hover:bg-blue-600 transition-colors duration-300">
            Shop Now
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-textDark text-3xl focus:outline-none"
          >
            {isOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-inner transition-all duration-300">
          <Link
            to="/"
            className="block px-6 py-3 text-textDark font-montserrat hover:text-accentBlue transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="block px-6 py-3 text-textDark font-montserrat hover:text-accentBlue transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="block px-6 py-3 text-textDark font-montserrat hover:text-accentBlue transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block px-6 py-3 text-textDark font-montserrat hover:text-accentBlue transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

          <div className="px-6 py-3">
            <Button
              className="w-full bg-accentBlue text-white hover:bg-blue-600 transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Shop Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNav;
