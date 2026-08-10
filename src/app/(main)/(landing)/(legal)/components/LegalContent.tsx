import React from "react";
import { LegalSidebar } from "./LegalSidebar";

interface SidebarItem {
  id: string;
  title: string;
}

interface LegalContentProps {
  sidebarItems: SidebarItem[];
  children: React.ReactNode;
}

export function LegalContent({ sidebarItems, children }: LegalContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start relative">
      {/* Sidebar (Desktop Only) */}
      <aside className="hidden lg:block lg:col-span-1 sticky top-28 self-start">
        <LegalSidebar items={sidebarItems} />
      </aside>

      {/* Main Content Area */}
      <article className="col-span-1 lg:col-span-3 max-w-[720px] w-full mx-auto lg:mx-0">
        {children}
      </article>
    </div>
  );
}
