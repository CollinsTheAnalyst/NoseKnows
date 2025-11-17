import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

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
import Brands from "./pages/Brands.jsx";
import BrandDetails from "./pages/BrandDetails.jsx";
import Confirmation from "./pages/confirmation.jsx";
import WishlistPage from "./pages/wishlistpage.jsx";
import CartPage from "./pages/CartPage.jsx"; 
// ✅ NEW: Import the component that collects delivery/payment details
import OrderDetailsForm from "./pages/OrderDetailsForm.jsx";


// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

// Simple error boundary for development
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl font-bold text-red-600">
            Oops! Something went wrong.
          </h1>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <TopNav />

      <main className="min-h-screen bg-accent text-secondary font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/product/:slug" element={<ProductDetails />} />

            {/* Brands */}
            <Route path="/brands" element={<Brands />} />
            <Route path="/brands/:slug" element={<BrandDetails />} />

            {/* Wishlist */}
            <Route path="/wishlist" element={<WishlistPage />}/>

            {/* Cart View: Loads the multi-item cart view */}
            <Route path="/checkout" element={<CartPage />} />
            
            {/* ✅ FIX: Route /checkout/summary to the Order Details Form */}
            <Route path="/checkout/summary" element={<OrderDetailsForm />} /> 

            {/* Final Confirmation Screen */}
            <Route path="/checkout/confirmation" element={<Confirmation />} />

            {/* Fallback route for unmatched paths */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <h1 className="text-2xl font-bold">Page Not Found</h1>
                </div>
              }
            />
          </Routes>
        </div>
      </main>

      <Footer />
    </ErrorBoundary>
  );
};

export default App;