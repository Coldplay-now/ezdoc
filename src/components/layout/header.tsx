"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Menu, X, Search, Languages } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchDialog } from "@/components/search/search-dialog";
import type { LocaleEntry } from "@/lib/config";

interface HeaderProps {
  siteTitle: string;
  githubUrl?: string;
  menuOpen?: boolean;
  onMenuToggle?: (open: boolean) => void;
  locale: string;
  locales: LocaleEntry[];
}

export function Header({ siteTitle, githubUrl, menuOpen = false, onMenuToggle, locale, locales }: HeaderProps) {
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

            {locales.length > 1 && (
              <LanguageSwitcher locale={locale} locales={locales} />
            )}

            <ThemeToggle />
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

// ---------------------------------------------------------------------------
// LanguageSwitcher
// ---------------------------------------------------------------------------

function LanguageSwitcher({
  locale,
  locales,
}: {
  locale: string;
  locales: LocaleEntry[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  function switchLocale(targetLocale: string) {
    // Replace /docs/{currentLocale}/... with /docs/{targetLocale}/...
    const newPath = pathname.replace(
      `/docs/${locale}/`,
      `/docs/${targetLocale}/`,
    );
    window.location.href = newPath;
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        onClick={() => setOpen(!open)}
        aria-label="Switch language"
        aria-expanded={open}
      >
        <Languages className="size-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[8rem] rounded-lg border border-border bg-background py-1 shadow-lg z-50">
          {locales.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`flex w-full items-center px-3 py-1.5 text-sm transition-colors ${
                l.code === locale
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-foreground hover:bg-muted"
              }`}
              onClick={() => {
                switchLocale(l.code);
                setOpen(false);
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
