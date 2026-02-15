import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ezdocConfig from "@config";
import { getAllSlugs } from "@/lib/mdx";
import { getNavigation } from "@/lib/docs";

export default function Home() {
  const title = ezdocConfig.site.title;
  const description = ezdocConfig.site.description ?? "Documentation";

  // Determine the first doc page to link to
  const navigation = getNavigation();
  let firstDocPath = "";
  if (navigation.length > 0 && navigation[0].pages.length > 0) {
    firstDocPath = navigation[0].pages[0].path;
  } else {
    const slugs = getAllSlugs();
    firstDocPath = slugs[0] ?? "";
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <main className="flex flex-col items-center gap-8 text-center">
        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          {title}
        </h1>

        {/* Description */}
        <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* CTA */}
        {firstDocPath && (
          <Link
            href={`/docs/${firstDocPath}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            开始阅读
            <ArrowRight className="size-4" />
          </Link>
        )}
      </main>
    </div>
  );
}
