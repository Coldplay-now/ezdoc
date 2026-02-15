"use client";

import { useState, useCallback, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import type { NavGroup } from "@/lib/docs";

interface DocsLayoutShellProps {
  siteTitle: string;
  githubUrl?: string;
  navigation: NavGroup[];
  children: ReactNode;
}

/**
 * Client-side layout shell for the /docs section.
 * Manages the mobile sidebar open/close state and coordinates
 * between Header (toggle button) and Sidebar (drawer).
 */
export function DocsLayoutShell({
  siteTitle,
  githubUrl,
  navigation,
  children,
}: DocsLayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Extract the current slug from the pathname
  // pathname is like /docs/getting-started or /docs/guide/intro
  const currentSlug = pathname.replace(/^\/docs\/?/, "").replace(/\/$/, "");

  const handleMenuToggle = useCallback((open: boolean) => {
    setSidebarOpen(open);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        siteTitle={siteTitle}
        githubUrl={githubUrl}
        menuOpen={sidebarOpen}
        onMenuToggle={handleMenuToggle}
      />
      <div className="flex flex-1">
        <Sidebar
          navigation={navigation}
          currentSlug={currentSlug}
          open={sidebarOpen}
          onClose={handleSidebarClose}
        />
        {children}
      </div>
    </div>
  );
}
