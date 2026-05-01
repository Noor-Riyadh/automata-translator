import React, { useEffect } from "react";

export default function Toast({ message, type = "error", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    error: "bg-red-900/90 border-red-500 text-red-200",
    success: "bg-emerald-900/90 border-emerald-500 text-emerald-200",
    info: "bg-blue-900/90 border-blue-500 text-blue-200",
    warning: "bg-amber-900/90 border-amber-500 text-amber-200",
  };

  const icons = {
    error: "✕",
    success: "✓",
    info: "ℹ",
    warning: "⚠",
  };

  return (
    <div
      className={`
      fixed top-6 left-1/2 -translate-x-1/2 z-[9999]
      flex items-start gap-3 px-5 py-4 rounded-xl border shadow-2xl
      backdrop-blur-sm max-w-md w-full
      animate-in fade-in slide-in-from-top-4 duration-300
      ${colors[type]}
    `}
    >
      <span className="text-lg font-bold mt-0.5 flex-shrink-0">
        {icons[type]}
      </span>
      <p className="text-sm leading-relaxed flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-current opacity-60 hover:opacity-100 text-lg leading-none flex-shrink-0 mt-0.5"
      >
        ×
      </button>
    </div>
  );
}
