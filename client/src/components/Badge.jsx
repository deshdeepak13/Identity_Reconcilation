import React from "react";

export default function Badge({ children, variant = "default" }) {
  const baseClasses =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm border";

  const variants = {
    default: "bg-gray-50 text-gray-700 border-gray-200",
    primary: "bg-blue-50 text-blue-700 border-blue-200",
    success: "bg-green-50 text-green-700 border-green-200",
    secondary: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <span className={`${baseClasses} ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
}
