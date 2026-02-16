import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  ArrowRight,
  Rocket,
  BookOpen,
  Code,
  Lightbulb,
  Layers,
  Compass,
  GraduationCap,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ezdocConfig from "@config";
import { getAllSlugs } from "@/lib/mdx";
import { getNavigation, getDefaultLocale } from "@/lib/docs";

const siteUrl = ezdocConfig.site.url ?? "";

export const metadata: Metadata = {
  title: ezdocConfig.site.title,
  description: ezdocConfig.site.description ?? "Documentation powered by ezdoc",
  openGraph: {
    type: "website",
    title: ezdocConfig.site.title,
    description: ezdocConfig.site.description ?? "Documentation powered by ezdoc",
    url: siteUrl || undefined,
  },
};

/* ------------------------------------------------------------------ */
/*  Card icon / color palette (cycles by index)                        */
/* ------------------------------------------------------------------ */

const cardStyles: { icon: LucideIcon; bg: string; fg: string }[] = [
  { icon: Rocket,         bg: "bg-violet-100 dark:bg-violet-500/15",  fg: "text-violet-600 dark:text-violet-400" },
  { icon: BookOpen,       bg: "bg-sky-100 dark:bg-sky-500/15",        fg: "text-sky-600 dark:text-sky-400" },
  { icon: Code,           bg: "bg-emerald-100 dark:bg-emerald-500/15", fg: "text-emerald-600 dark:text-emerald-400" },
  { icon: Lightbulb,      bg: "bg-amber-100 dark:bg-amber-500/15",    fg: "text-amber-600 dark:text-amber-400" },
  { icon: Layers,         bg: "bg-rose-100 dark:bg-rose-500/15",      fg: "text-rose-600 dark:text-rose-400" },
  { icon: Compass,        bg: "bg-cyan-100 dark:bg-cyan-500/15",      fg: "text-cyan-600 dark:text-cyan-400" },
  { icon: GraduationCap,  bg: "bg-indigo-100 dark:bg-indigo-500/15",  fg: "text-indigo-600 dark:text-indigo-400" },
  { icon: Wrench,         bg: "bg-orange-100 dark:bg-orange-500/15",  fg: "text-orange-600 dark:text-orange-400" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const title = ezdocConfig.site.title;
  const description = ezdocConfig.site.description ?? "Documentation";

  // Determine the first doc page to link to
  const defaultLocale = getDefaultLocale();
  const navigation = getNavigation(defaultLocale);
  let firstDocPath = "";
  if (navigation.length > 0 && navigation[0].pages.length > 0) {
    firstDocPath = navigation[0].pages[0].path;
  } else {
    const slugs = getAllSlugs(defaultLocale);
    firstDocPath = slugs[0] ?? "";
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4">
      {/* Hero */}
      <main className="flex flex-col items-center gap-8 pt-24 pb-16 text-center sm:pt-32">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          {title}
        </h1>

        <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>

        {firstDocPath && (
          <Link
            href={`/docs/${defaultLocale}/${firstDocPath}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            开始阅读
            <ArrowRight className="size-4" />
          </Link>
        )}
      </main>

      {/* Navigation group cards */}
      {navigation.length > 0 && (
        <section className="mx-auto w-full max-w-4xl pb-24">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {navigation.map((group, i) => {
              const firstPage = group.pages[0];
              if (!firstPage) return null;
              const style = cardStyles[i % cardStyles.length];
              const Icon = style.icon;
              return (
                <Link
                  key={group.group}
                  href={`/docs/${defaultLocale}/${firstPage.path}`}
                  className="group flex flex-col rounded-xl border border-border bg-background p-6 transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className={cn("mb-4 inline-flex size-10 items-center justify-center rounded-lg", style.bg)}>
                    <Icon className={cn("size-5", style.fg)} />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {group.group}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {group.pages.length} 篇文档
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    浏览
                    <ArrowRight className="size-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
