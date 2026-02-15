"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Github, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  siteTitle: string;
  githubUrl?: string;
  onMenuToggle?: (open: boolean) => void;
}

export function Header({ siteTitle, githubUrl, onMenuToggle }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      const next = !prev;
      onMenuToggle?.(next);
      return next;
    });
  }, [onMenuToggle]);

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left: Logo / Title */}
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground hover:text-foreground/80 transition-colors"
          >
            {siteTitle}
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="size-5" />
            </a>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
