import React from "react";
import { useSearchParams } from "react-router-dom";

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg p-10 rounded-2xl text-center">
        <h1 className="text-3xl font-bold text-[#00306b] mb-4">
          Order Placed 🎉
        </h1>
        <p className="text-gray-700 mb-2">
          Your order ID is <strong>{orderId}</strong>.
        </p>
        <p className="text-gray-500">
          Please check your phone for an M-Pesa payment prompt.
        </p>
      </div>
    </div>
  );
};

export default Confirmation;
