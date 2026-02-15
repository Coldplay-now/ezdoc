"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Github, Menu, X, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchDialog } from "@/components/search/search-dialog";

interface HeaderProps {
  siteTitle: string;
  githubUrl?: string;
  menuOpen?: boolean;
  onMenuToggle?: (open: boolean) => void;
}

export function Header({ siteTitle, githubUrl, menuOpen = false, onMenuToggle }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    onMenuToggle?.(!menuOpen);
  }, [onMenuToggle, menuOpen]);

  /* ---------- Global Cmd/Ctrl+K shortcut ---------- */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger when user is typing in an input/textarea/contenteditable
      const tag = (e.target as HTMLElement)?.tagName;
      const isEditable =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target as HTMLElement)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        if (isEditable) return;
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
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
              {menuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
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
            {/* Desktop: search trigger styled as input */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden md:inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Search className="size-4" />
              <span>搜索文档...</span>
              <kbd className="ml-2 inline-flex h-5 items-center rounded border border-border bg-background px-1.5 text-[11px] font-medium text-muted-foreground">
                &#8984;K
              </kbd>
            </button>

            {/* Mobile: search icon button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="size-5" />
            </button>

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

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
