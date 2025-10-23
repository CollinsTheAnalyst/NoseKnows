// src/components/Button.jsx
import React from "react";

const Button = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-accent text-white px-6 py-3 rounded hover:bg-accent/90 font-montserrat"
    >
      {children}
    </button>
  );
};

export default Button;
