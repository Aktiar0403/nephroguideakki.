import React, { useState } from "react";

export default function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 border border-slate-200 rounded-lg shadow-sm bg-white overflow-hidden">
      <button
        className="w-full flex justify-between items-center px-4 py-3 bg-indigo-600 text-white font-medium focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span className="text-xl">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-50 transition-all duration-300 ease-in-out">
          {children}
        </div>
      )}
    </div>
  );
}