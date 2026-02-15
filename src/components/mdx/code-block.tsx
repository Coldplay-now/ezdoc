"use client";

import { type ReactNode, useRef, useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  /** File name or language label shown in the header bar. */
  title?: string;
  /** Whether to render line numbers (adds a CSS class to the container). */
  showLineNumbers?: boolean;
  /** The `<pre>` element produced by rehype-pretty-code. */
  children: ReactNode;
}

export function CodeBlock({
  title,
  showLineNumbers = false,
  children,
}: CodeBlockProps) {
  const preRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!preRef.current) return;

    // Extract the raw text content from the rendered <pre> inside the wrapper.
    const code = preRef.current.querySelector("pre")?.textContent ?? "";

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silently ignore if clipboard API is unavailable.
    }
  }, []);

  return (
    <div
      className={cn(
        "group/code-block my-6 overflow-hidden rounded-lg border",
        "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
      )}
    >
      {/* Header bar — always rendered to host the copy button; title is optional */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-2",
          "border-b border-zinc-200 bg-zinc-100/80 dark:border-zinc-800 dark:bg-zinc-800/60"
        )}
      >
        <span className="select-none text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {title ?? ""}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy code"}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
            "text-zinc-500 hover:bg-zinc-200/70 hover:text-zinc-700",
            "dark:text-zinc-400 dark:hover:bg-zinc-700/60 dark:hover:text-zinc-200"
          )}
        >
          {copied ? (
            <>
              <Check className="size-3.5" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code area */}
      <div
        ref={preRef}
        className={cn(
          "overflow-x-auto text-sm leading-relaxed",
          "[&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-4",
          "[&_code]:bg-transparent",
          showLineNumbers && "[&_code]:[counter-reset:line]",
          showLineNumbers &&
            "[&_code>span.line]:before:mr-6 [&_code>span.line]:before:inline-block [&_code>span.line]:before:w-4 [&_code>span.line]:before:text-right [&_code>span.line]:before:text-zinc-400 [&_code>span.line]:before:content-[counter(line)] [&_code>span.line]:before:[counter-increment:line] dark:[&_code>span.line]:before:text-zinc-600"
        )}
      >
        {children}
      </div>
    </div>
  );
}
