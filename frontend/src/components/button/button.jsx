// src/components/Button.jsx
import React from "react";

const Button = ({ children, onClick, className, ...props }) => { // 1. Accept 'className' prop
  const baseStyles = "bg-accent text-white px-6 py-3 rounded hover:bg-accent/90 font-montserrat"; // Your default styles

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${className || ''}`} // 2. Combine default styles with passed className
      {...props} // 3. Pass any other props like type="submit" etc.
    >
      {children}
    </button>
  );
};

export default Button;