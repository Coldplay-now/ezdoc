import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
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
            {navigation.map((group) => {
              const firstPage = group.pages[0];
              if (!firstPage) return null;
              return (
                <Link
                  key={group.group}
                  href={`/docs/${defaultLocale}/${firstPage.path}`}
                  className="group flex flex-col rounded-xl border border-border bg-background p-6 transition-colors hover:border-primary/40 hover:shadow-sm"
                >
                  <FileText className="mb-3 size-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    {group.group}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {group.pages.length} 篇文档
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
