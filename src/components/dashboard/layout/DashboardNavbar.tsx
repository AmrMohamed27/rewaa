"use client";

import { Logo } from "@/components/landing/layout/logo";
import { ThemeToggle } from "@/components/landing/layout/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { navConfig } from "@/config/nav-config";
import Link from "next/link";
import { useState } from "react"; // Added useState
import { SearchDialog, SearchTrigger } from "./SearchInput"; // Updated imports
import { NotificationsPopover } from "./NotificationsPopover";

export function DashboardNavbar() {
  const [searchOpen, setSearchOpen] = useState(false); // Global search state

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="absolute top-0 left-0" />
          <Link href={navConfig.primaryLink.href} className="flex items-center">
            <Logo brandName="Dashboard" />
          </Link>
        </div>

        {/* Global Search (Desktop Trigger) */}
        <div className="flex-1 px-4 max-w-md hidden md:block">
          <SearchTrigger onClick={() => setSearchOpen(true)} />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Global Search (Mobile Trigger) */}
          <div className="md:hidden">
            <SearchTrigger onClick={() => setSearchOpen(true)} />
          </div>

          <NotificationsPopover />
          <ThemeToggle />
        </div>
      </div>

      {/* Render Dialog strictly ONCE */}
      <SearchDialog open={searchOpen} setOpen={setSearchOpen} />
    </header>
  );
}
