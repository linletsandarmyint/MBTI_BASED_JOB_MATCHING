import React from "react";

export default function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  const base = "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-300",
    secondary: "bg-white border text-gray-800 hover:bg-gray-50 focus:ring-gray-200",
    ghost: "bg-transparent text-gray-800 hover:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const cls = `${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
