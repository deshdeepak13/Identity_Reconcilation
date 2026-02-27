import React from "react";

export default function Badge({ children, variant = "default" }) {
  const baseClasses =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm border";

  const variants = {
    default: "bg-zinc-800 text-zinc-300 border-zinc-700",
    primary: "bg-orange-500/10 text-orange-500 border-orange-500/30",
    success: "bg-orange-600/20 text-orange-400 border-orange-600/40",
    secondary: "bg-zinc-800 text-zinc-400 border-zinc-700",
  };

  return (
    <span className={`${baseClasses} ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
}
