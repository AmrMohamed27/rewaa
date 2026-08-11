import React from "react";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-tasto-bg text-tasto-white font-sans">
      {/* Page Wrapping Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 pt-32 pb-24">{children}</div>
    </div>
  );
}
