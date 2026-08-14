import React, { useEffect } from "react";

export default function Modal({ title, children, onClose, className = "", ...props }) {
  const baseClass = "w-full max-w-lg p-6";
  const finalClass = `${baseClass} ${className}`.trim();
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose && onClose();
    };
    // prevent body scroll while modal is open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        className={`bg-white rounded-lg shadow-lg ${finalClass} mx-auto max-h-[90vh] overflow-auto`}
        {...props}
      >
        <div className="flex justify-between items-center mb-4">
          {title ? <h3 className="text-lg font-semibold">{title}</h3> : <div />}
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-gray-500 hover:text-gray-700 rounded-full p-1"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">{children}</div>
      </div>
    </div>
  );
}
