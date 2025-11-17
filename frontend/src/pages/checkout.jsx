import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  // Helper function to safely parse product price
  const parsePrice = (prod) => {
    // FIX: Use parseFloat and default to 0 to handle string prices from API
    const priceValue = prod?.variants?.[0]?.price || prod?.price;
    return parseFloat(priceValue) || 0;
  };

  // Default values, initialized with parsed float values
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [basePrice, setBasePrice] = useState(parsePrice(product));
  const [total, setTotal] = useState(parsePrice(product));
  const [loading, setLoading] = useState(false);

  // Update base price and total when product changes
  useEffect(() => {
    if (product) {
      const newPrice = parsePrice(product);
      setBasePrice(newPrice);
      // Ensure total is recalculated with the initial quantity
      setTotal(newPrice * quantity); 
    }
  }, [product, quantity]);

  // Recalculate total when quantity or basePrice changes
  useEffect(() => {
    setTotal(basePrice * quantity);
  }, [quantity, basePrice]);

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!phone) {
      alert("Please enter your phone number.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/checkout/mpesa-pay/",
        { phone, amount: total },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(response.data);
      alert("✅ STK Push sent. Please complete payment on your phone.");
      navigate("/checkout/confirmation");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("❌ Payment failed. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[120px] pb-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#00306b]">
          Checkout
        </h2>

        {product ? (
          <div className="mb-6 text-center">
            {/* FIX: Access image via images array/image_url */}
            {product.images?.[0]?.image_url && (
              <img
                src={product.images[0].image_url}
                alt={product.name}
                className="w-32 h-32 object-cover mx-auto rounded-lg mb-3 shadow-sm"
              />
            )}
            <h3 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h3>
            <p className="text-gray-600">
              Price per item:{" "}
              <span className="font-semibold text-[#00306b]">
                {/* FIX: Use toFixed(2) for correct currency format */}
                Ksh {basePrice.toFixed(2)}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-gray-500 mb-4 text-center">No product selected</p>
        )}

        <form onSubmit={handleCheckout}>
          {/* Quantity Selector */}
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                −
              </button>
              <span className="font-medium text-gray-800">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Total Amount */}
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">
              Total Amount
            </label>
            <input
              type="text" // Changed to text to properly display formatted total
              value={`Ksh ${total.toFixed(2)}`} // FIX: Display formatted total
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-800 font-semibold"
            />
          </div>

          {/* Phone Input */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="2547xxxxxxxx"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#00306b] outline-none"
              required
            />
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={loading || total === 0}
            className="w-full bg-[#00306b] text-white py-2 rounded-lg font-medium hover:bg-[#00408a] transition disabled:bg-gray-400"
          >
            {loading
              ? "Processing..."
              : `Pay Ksh ${total.toFixed(2)} with M-Pesa`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;