"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  id: string;
  title: string;
}

interface LegalSidebarProps {
  items: SidebarItem[];
}

export function LegalSidebar({ items }: LegalSidebarProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");
  const isManualScrolling = useRef<boolean>(false);

  useEffect(() => {
    if (items.length === 0) return;

    const observerOptions: IntersectionObserverInit = {
      rootMargin: "-120px 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      // If we are currently handling a manual click scroll, don't update from scroll events
      if (isManualScrolling.current) return;

      // Find the entry that is intersecting
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // If multiple are visible, pick the one closest to the top of the viewport
        const sorted = visibleEntries.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        );
        setActiveId(sorted[0].target.id);
      }
    }, observerOptions);

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    // Special case: check if we are at the very bottom of the page
    const handleScroll = () => {
      if (isManualScrolling.current) return;

      const isBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;

      if (isBottom) {
        setActiveId(items[items.length - 1].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      isManualScrolling.current = true;
      setActiveId(id);

      el.scrollIntoView({ behavior: "smooth", block: "start" });

      // Update hash in URL
      window.history.pushState(null, "", `#${id}`);

      // Re-enable scroll observer updates after smooth scroll finishes
      setTimeout(() => {
        isManualScrolling.current = false;
      }, 800); // 800ms is standard smooth scroll duration
    }
  };

  return (
    <nav className="py-2 border-l border-tasto-white/10 pl-0">
      <div className="text-xs font-semibold uppercase tracking-wider text-tasto-white/40 mb-6 pl-4">
        On this page
      </div>
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={cn(
                  "block text-[13px] leading-relaxed transition-all duration-200 pl-4 border-l -ml-[1px] py-1.5 font-sans",
                  isActive
                    ? "text-tasto-cyan font-medium border-tasto-cyan"
                    : "text-tasto-white/40 border-transparent hover:text-tasto-white/80",
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
