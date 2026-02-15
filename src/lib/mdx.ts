import type React from "react";
import fs from "node:fs";
import path from "node:path";
import { compileMDX as _compileMDX } from "next-mdx-remote/rsc";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeMdxImportMedia from "rehype-mdx-import-media";
import matter from "gray-matter";
import type { Options as RehypePrettyCodeOptions } from "rehype-pretty-code";

import ezdocConfig from "@config";

// ---------------------------------------------------------------------------
// Frontmatter type
// ---------------------------------------------------------------------------
export interface Frontmatter {
  title?: string;
  description?: string;
  date?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Resolve docs directory from ezdoc.config.ts
// ---------------------------------------------------------------------------
function getDocsDir(): string {
  return ezdocConfig.docs?.dir ?? "docs";
}

// ---------------------------------------------------------------------------
// 1. compileMDX
// ---------------------------------------------------------------------------
export async function compileMDX(
  source: string,
  options?: { components?: Record<string, React.ComponentType<unknown>> },
) {
  const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
    theme: {
      dark: "github-dark",
      light: "github-light",
    },
    keepBackground: false,
  };

  const { content, frontmatter } = await _compileMDX<Frontmatter>({
    source,
    components: options?.components,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkFrontmatter, remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeKatex,
          [rehypePrettyCode, rehypePrettyCodeOptions],
          rehypeSlug,
          rehypeAutolinkHeadings,
          rehypeMdxImportMedia,
        ],
      },
    },
  });

  return { content, frontmatter };
}

// ---------------------------------------------------------------------------
// 2. getDocBySlug
// ---------------------------------------------------------------------------
export async function getDocBySlug(
  slug: string,
  options?: { components?: Record<string, React.ComponentType<unknown>> },
) {
  const docsDir = getDocsDir();
  const basePath = path.join(process.cwd(), docsDir);

  // slug 可能是 "getting-started" 或 "guide/intro" 等形式
  const slugParts = slug.split("/");
  const mdxPath = path.join(basePath, ...slugParts) + ".mdx";
  const mdPath = path.join(basePath, ...slugParts) + ".md";

  // 优先 .mdx
  let filePath: string;
  if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  } else {
    throw new Error(`Document not found for slug: ${slug}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");

  // 用 gray-matter 提取 frontmatter
  const { data } = matter(raw);

  // 编译 MDX（传入去掉 frontmatter 后的内容，避免重复解析）
  const { content, frontmatter } = await compileMDX(raw, {
    components: options?.components,
  });

  return {
    content,
    frontmatter: { ...data, ...frontmatter } as Frontmatter,
    raw,
    slug,
  };
}

// ---------------------------------------------------------------------------
// 3. getAllSlugs
// ---------------------------------------------------------------------------
export function getAllSlugs(): string[] {
  const docsDir = getDocsDir();
  const basePath = path.join(process.cwd(), docsDir);

  if (!fs.existsSync(basePath)) {
    return [];
  }

  const slugs: string[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (/\.(md|mdx)$/.test(entry.name)) {
        // 相对于 basePath 的路径，去掉扩展名
        const relativePath = path.relative(basePath, fullPath);
        const slug = relativePath.replace(/\.(md|mdx)$/, "");
        slugs.push(slug);
      }
    }
  }

  walk(basePath);
  return slugs;
}
