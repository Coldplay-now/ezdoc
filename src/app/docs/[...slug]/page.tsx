import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDocBySlug, getAllSlugs } from "@/lib/mdx";
import { getNavigation, extractToc, getPrevNext } from "@/lib/docs";
import { components } from "@/components/mdx/mdx-components";
import { TableOfContents } from "@/components/layout/toc";
import { DocPagination } from "@/components/layout/doc-pagination";
import ezdocConfig from "@config";

// ---------------------------------------------------------------------------
// Static params generation for static export
// ---------------------------------------------------------------------------
export function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug: slug.split("/"),
  }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");

  const siteUrl = ezdocConfig.site.url ?? "";

  try {
    const doc = await getDocBySlug(slug, {
      components: components as Record<string, React.ComponentType<unknown>>,
    });

    const title = doc.frontmatter.title ?? slug;
    const description = doc.frontmatter.description;
    const pageUrl = siteUrl ? `${siteUrl}/docs/${slug}` : undefined;

    return {
      title,
      description,
      openGraph: {
        type: "article",
        title,
        description: description ?? undefined,
        url: pageUrl,
      },
    };
  } catch {
    return { title: "Not Found" };
  }
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");

  let doc;
  try {
    doc = await getDocBySlug(slug, {
      components: components as Record<string, React.ComponentType<unknown>>,
    });
  } catch {
    notFound();
  }

  const navigation = getNavigation();
  const toc = extractToc(doc.raw);
  const { prev, next } = getPrevNext(slug, navigation);

  return (
    <>
      {/* Main content area */}
      <main className="min-w-0 flex-1 px-6 py-8 lg:px-10 lg:py-10 max-w-3xl mx-auto xl:mx-0 xl:max-w-none">
        {/* Article header */}
        {doc.frontmatter.title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {doc.frontmatter.title}
            </h1>
            {doc.frontmatter.description && (
              <p className="mt-2 text-lg text-muted-foreground">
                {doc.frontmatter.description}
              </p>
            )}
          </div>
        )}

        {/* MDX content */}
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          {doc.content}
        </article>

        {/* Prev / Next navigation */}
        <DocPagination prev={prev} next={next} />
      </main>

      {/* Right TOC */}
      <TableOfContents toc={toc} />
    </>
  );
}
