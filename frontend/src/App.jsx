// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Components
import TopNav from "./components/navigation/TopNav.jsx";
import Footer from "./components/footer/Footer.jsx";

// Pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Shop from "./pages/Shop.jsx";
import Contact from "./pages/Contact.jsx";
import Blog from "./pages/Blog.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Brands from "./pages/Brands.jsx"; // Brand list page
import BrandDetails from "./pages/BrandDetails.jsx"; // Brand details page

// ScrollToTop ensures the page always scrolls to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      {/* Navigation */}
      <TopNav />

      {/* Main content wrapper: consistent padding and background like M7 */}
      <main className="min-h-screen bg-accent text-secondary font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/product/:slug" element={<ProductDetails />} />


            {/* Brands */}
            <Route path="/brands" element={<Brands />} /> {/* Brand list page */}
            <Route path="/brands/:slug" element={<BrandDetails />} /> {/* Brand detail page */}
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </Router>
  );
};

export default App;
