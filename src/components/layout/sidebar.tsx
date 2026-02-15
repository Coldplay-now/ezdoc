"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavGroup } from "@/lib/docs";

interface SidebarProps {
  navigation: NavGroup[];
  currentSlug: string;
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  navigation,
  currentSlug,
  open = false,
  onClose,
}: SidebarProps) {
  // Track which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    // Default: expand the group containing the current page
    for (const group of navigation) {
      if (group.pages.some((page) => page.path === currentSlug)) {
        initial.add(group.group);
      }
    }
    // If nothing matched, expand the first group
    if (initial.size === 0 && navigation.length > 0) {
      initial.add(navigation[0].group);
    }
    return initial;
  });

  const toggleGroup = useCallback((group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  }, []);

  // Close mobile sidebar when navigating
  useEffect(() => {
    onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlug]);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          // Base styles
          "fixed top-16 z-40 h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-border bg-background overflow-y-auto",
          // Desktop: always visible
          "lg:sticky lg:block",
          // Mobile: slide-in drawer
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "transition-transform duration-200 ease-in-out",
        )}
      >
        <nav className="px-3 py-4" aria-label="Documentation navigation">
          {navigation.map((group) => {
            const isExpanded = expandedGroups.has(group.group);

            return (
              <div key={group.group} className="mb-4">
                {/* Group header */}
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => toggleGroup(group.group)}
                  aria-expanded={isExpanded}
                >
                  <span>{group.group}</span>
                  <ChevronRight
                    className={cn(
                      "size-3.5 transition-transform duration-200",
                      isExpanded && "rotate-90",
                    )}
                  />
                </button>

                {/* Group items */}
                {isExpanded && (
                  <ul className="mt-1 space-y-0.5">
                    {group.pages.map((page) => {
                      const isActive = page.path === currentSlug;
                      return (
                        <li key={page.path}>
                          <Link
                            href={`/docs/${page.path}`}
                            className={cn(
                              "block rounded-md px-2 py-1.5 text-sm transition-colors",
                              isActive
                                ? "bg-primary/10 font-medium text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                            aria-current={isActive ? "page" : undefined}
                          >
                            {page.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
