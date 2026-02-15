import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ezdocConfig from "@config";

// ─── 类型定义 ───────────────────────────────────────────────

export interface NavItem {
  title: string;
  path: string;
}

export interface NavGroup {
  group: string;
  pages: NavItem[];
}

export interface TocItem {
  depth: number; // 2-4 (h2-h4)
  text: string;
  id: string;
}

export interface DocMeta {
  title: string;
  description?: string;
  icon?: string;
  slug: string;
}

// ─── locale 辅助 ────────────────────────────────────────────

/** 获取默认 locale */
export function getDefaultLocale(): string {
  return ezdocConfig.i18n?.defaultLocale ?? "zh";
}

/** 获取所有 locale code 列表 */
export function getAllLocales(): string[] {
  const locales = ezdocConfig.i18n?.locales ?? [{ code: "zh", label: "中文" }];
  return locales.map((l) => (typeof l === "string" ? l : l.code));
}

// ─── 内部工具 ───────────────────────────────────────────────

/** 从配置获取 docs 目录路径（locale 子目录） */
function getDocsDir(locale: string): string {
  const dir = ezdocConfig.docs?.dir ?? "docs";
  return path.join(process.cwd(), dir, locale);
}

/** 从配置获取导航配置文件名 */
function getNavFileName(): string {
  return ezdocConfig.docs?.nav ?? "docs.json";
}

/** 读取 markdown/mdx 文件的 frontmatter */
function readFrontmatter(filePath: string): Record<string, unknown> {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    return data;
  } catch {
    return {};
  }
}

/** 根据 slug 解析出文件的绝对路径（尝试 .mdx 和 .md） */
function resolveDocFile(slug: string, locale: string): string | null {
  const docsDir = getDocsDir(locale);
  const extensions = [".mdx", ".md"];
  for (const ext of extensions) {
    const filePath = path.join(docsDir, slug + ext);
    if (fs.existsSync(filePath)) return filePath;
  }
  return null;
}

/** 从文件系统读取 slug 对应的标题 */
function getTitleForSlug(slug: string, locale: string): string {
  const filePath = resolveDocFile(slug, locale);
  if (!filePath) return slug;
  const fm = readFrontmatter(filePath);
  return (fm.title as string) || path.basename(slug);
}

/** 递归扫描目录下的 .md/.mdx 文件，返回相对 docsDir 的路径（无扩展名） */
function scanMarkdownFiles(dir: string, base: string = ""): string[] {
  const result: string[] = [];
  if (!fs.existsSync(dir)) return result;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...scanMarkdownFiles(fullPath, path.join(base, entry.name)));
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      const slug = path.join(base, entry.name.replace(/\.(md|mdx)$/, ""));
      result.push(slug);
    }
  }
  return result;
}

// ─── getNavigation ──────────────────────────────────────────

/**
 * 获取导航结构。
 * 优先从 docs/{locale}/docs.json 读取，不存在则回退到目录扫描。
 */
export function getNavigation(locale: string): NavGroup[] {
  const docsDir = getDocsDir(locale);
  const navFile = path.join(docsDir, getNavFileName());

  // 1. 优先读取 docs.json
  if (fs.existsSync(navFile)) {
    return parseNavFile(navFile, locale);
  }

  // 2. 回退：扫描目录
  return buildNavFromDirectory(docsDir, locale);
}

/** 解析 docs.json 导航配置文件 */
function parseNavFile(navFile: string, locale: string): NavGroup[] {
  const raw = fs.readFileSync(navFile, "utf-8");

  let json: {
    navigation: Array<{
      group: string;
      pages: Array<string | { title: string; path: string }>;
    }>;
  };

  try {
    json = JSON.parse(raw);
  } catch (err) {
    console.error(
      `[ezdoc] Failed to parse ${navFile}: ${err instanceof Error ? err.message : err}`
    );
    return [];
  }

  if (!json.navigation || !Array.isArray(json.navigation)) {
    console.error(`[ezdoc] Invalid docs.json: missing "navigation" array in ${navFile}`);
    return [];
  }

  return json.navigation.map((group) => ({
    group: group.group,
    pages: group.pages.map((page): NavItem => {
      if (typeof page === "string") {
        return {
          title: getTitleForSlug(page, locale),
          path: page,
        };
      }
      return { title: page.title, path: page.path };
    }),
  }));
}

/** 扫描目录构建导航（回退方案） */
function buildNavFromDirectory(docsDir: string, locale: string): NavGroup[] {
  const slugs = scanMarkdownFiles(docsDir);
  slugs.sort((a, b) => a.localeCompare(b));

  const groups = new Map<string, NavItem[]>();

  for (const slug of slugs) {
    const dir = path.dirname(slug);
    const groupName = dir === "." ? "文档" : dir;

    if (!groups.has(groupName)) {
      groups.set(groupName, []);
    }

    const filePath = resolveDocFile(slug, locale);
    const fm = filePath ? readFrontmatter(filePath) : {};
    const title = (fm.title as string) || path.basename(slug);

    groups.get(groupName)!.push({ title, path: slug });
  }

  return Array.from(groups.entries()).map(([group, pages]) => ({
    group,
    pages,
  }));
}

// ─── extractToc ─────────────────────────────────────────────

/**
 * 从 markdown 原始内容中提取 h2-h4 标题，生成目录。
 */
export function extractToc(rawContent: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = rawContent.split("\n");
  let inCodeBlock = false;

  for (const line of lines) {
    // 跳过代码块中的内容
    if (/^```/.test(line.trimStart())) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (!match) continue;

    const depth = match[1].length as 2 | 3 | 4;
    const text = match[2].trim();
    const id = generateId(text);

    items.push({ depth, text, id });
  }

  return items;
}

/** 生成标题 id：中文保留，空格转 -，转小写 */
function generateId(text: string): string {
  const id = text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fff-]/g, "");
  return id || "section";
}

// ─── getPrevNext ────────────────────────────────────────────

/**
 * 根据当前 slug，在导航树中查找前一页和后一页。
 */
export function getPrevNext(
  currentSlug: string,
  navigation: NavGroup[]
): { prev: NavItem | null; next: NavItem | null } {
  // 将导航树扁平化为有序列表
  const flat: NavItem[] = navigation.flatMap((group) => group.pages);

  const index = flat.findIndex((item) => item.path === currentSlug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? flat[index - 1] : null,
    next: index < flat.length - 1 ? flat[index + 1] : null,
  };
}
