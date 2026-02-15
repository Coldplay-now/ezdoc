"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <span className="group/tooltip relative inline-block">
      <span
        className={cn(
          "cursor-help border-b border-dashed border-muted-foreground/50"
        )}
      >
        {children}
      </span>

      {/* Tooltip bubble */}
      <span
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2",
          "whitespace-nowrap rounded-md bg-foreground px-3 py-1.5 text-xs text-background",
          "opacity-0 transition-opacity duration-150 group-hover/tooltip:opacity-100"
        )}
        role="tooltip"
      >
        {content}
        {/* Arrow */}
        <span
          className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground"
          aria-hidden="true"
        />
      </span>
    </span>
  );
}
