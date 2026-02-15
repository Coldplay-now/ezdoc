"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/docs";

interface TocProps {
  toc: TocItem[];
}

export function TableOfContents({ toc }: TocProps) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (toc.length === 0) return;

    // Disconnect previous observer
    observerRef.current?.disconnect();

    const headingElements = toc
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    // Use IntersectionObserver to track which heading is in view
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the first entry that is intersecting
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        // rootMargin: negative top to account for sticky header,
        // observe headings when they enter the top portion of the viewport
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      },
    );

    for (const el of headingElements) {
      observerRef.current.observe(el);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <aside className="hidden xl:block sticky top-16 h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto py-8 pl-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          On this page
        </p>
        <ul className="space-y-1 text-sm">
          {toc.map((item) => {
            const isActive = activeId === item.id;
            // Indent based on heading depth: h2=0, h3=1, h4=2
            const indent = item.depth - 2;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "block py-1 leading-snug transition-colors border-l-2",
                    indent === 0 && "pl-3",
                    indent === 1 && "pl-6",
                    indent >= 2 && "pl-9",
                    isActive
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/40",
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(item.id);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                      // Update URL hash without scrolling
                      window.history.replaceState(null, "", `#${item.id}`);
                      setActiveId(item.id);
                    }
                  }}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
