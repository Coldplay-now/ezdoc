import { type ReactNode } from "react";
import {
  Info,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "info" | "warning" | "error" | "tip";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const calloutConfig: Record<
  CalloutType,
  { icon: LucideIcon; styles: string; iconColor: string; titleColor: string }
> = {
  info: {
    icon: Info,
    styles: cn(
      "border-blue-300 bg-blue-50 text-blue-900",
      "dark:border-blue-700 dark:bg-blue-950/30 dark:text-blue-200"
    ),
    iconColor: "text-blue-500 dark:text-blue-400",
    titleColor: "text-blue-900 dark:text-blue-100",
  },
  warning: {
    icon: AlertTriangle,
    styles: cn(
      "border-amber-300 bg-amber-50 text-amber-900",
      "dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200"
    ),
    iconColor: "text-amber-500 dark:text-amber-400",
    titleColor: "text-amber-900 dark:text-amber-100",
  },
  error: {
    icon: AlertCircle,
    styles: cn(
      "border-red-300 bg-red-50 text-red-900",
      "dark:border-red-700 dark:bg-red-950/30 dark:text-red-200"
    ),
    iconColor: "text-red-500 dark:text-red-400",
    titleColor: "text-red-900 dark:text-red-100",
  },
  tip: {
    icon: Lightbulb,
    styles: cn(
      "border-emerald-300 bg-emerald-50 text-emerald-900",
      "dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200"
    ),
    iconColor: "text-emerald-500 dark:text-emerald-400",
    titleColor: "text-emerald-900 dark:text-emerald-100",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "my-6 rounded-lg border-l-4 px-5 py-4",
        config.styles
      )}
      role="note"
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn("mt-0.5 size-5 shrink-0", config.iconColor)}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          {title && (
            <p
              className={cn(
                "mb-1.5 text-sm font-semibold leading-snug",
                config.titleColor
              )}
            >
              {title}
            </p>
          )}
          <div className="text-sm leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
