# ezdoc

基于 Git 仓库的文档管理与渲染系统。使用 Markdown/MDX 编写文档，自动编译为高质量静态文档站点。

## 特性

- **Markdown & MDX** — 同时支持 `.md` 和 `.mdx` 格式，MDX 中可使用 React 组件
- **语法高亮** — 基于 Shiki，支持双主题（亮色/暗色），100+ 语言
- **数学公式** — KaTeX 渲染，支持行内 `$...$` 和块级 `$$...$$`
- **Mermaid 图表** — 客户端渲染流程图、时序图、类图等
- **内置组件** — Callout 提示框、Tabs 标签页、CodeBlock 增强代码块
- **导航系统** — `docs.json` 配置优先，目录扫描自动回退
- **暗色模式** — 支持亮色/暗色/跟随系统，一键切换
- **纯静态导出** — 零服务端依赖，可部署到任何静态托管
- **响应式布局** — 三栏布局（侧边栏 + 内容 + TOC），移动端自适应

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建静态站点
pnpm build
```

构建产物输出到 `out/` 目录，可直接部署。

## 项目结构

```
ezdoc/
├── docs/                   # 文档目录
│   ├── docs.json           # 导航配置
│   ├── getting-started.mdx
│   └── guide/
│       └── configuration.mdx
├── src/
│   ├── app/                # Next.js 页面
│   ├── components/
│   │   ├── layout/         # 布局组件（Header, Sidebar, TOC）
│   │   └── mdx/            # MDX 组件（Callout, Tabs, Mermaid...）
│   └── lib/
│       ├── config.ts       # 配置加载
│       ├── docs.ts         # 导航解析引擎
│       └── mdx.ts          # MDX 编译引擎
├── ezdoc.config.ts         # 项目配置
├── next.config.ts
└── package.json
```

## 配置

在项目根目录的 `ezdoc.config.ts` 中集中管理配置：

```ts
import { defineConfig } from "./src/lib/config";

export default defineConfig({
  site: {
    title: "My Docs",
    description: "我的文档站点",
    socials: {
      github: "https://github.com/your/repo",
    },
  },
  docs: {
    dir: "docs",       // 文档目录
    nav: "docs.json",  // 导航配置文件
  },
  theme: {
    defaultMode: "system",   // "light" | "dark" | "system"
    primaryColor: "#3b82f6",
  },
  deploy: {
    basePath: "",      // 部署子路径
  },
});
```

## 导航配置

在 `docs/docs.json` 中定义文档导航结构：

```json
{
  "navigation": [
    {
      "group": "入门",
      "pages": ["getting-started"]
    },
    {
      "group": "指南",
      "pages": [
        { "title": "配置指南", "path": "guide/configuration" }
      ]
    }
  ]
}
```

如果不提供 `docs.json`，系统会自动扫描文档目录生成导航。

## 编写文档

在 `docs/` 目录下创建 `.md` 或 `.mdx` 文件：

```mdx
---
title: 页面标题
description: 页面描述
---

## 正文内容

支持所有 GFM 语法、数学公式、Mermaid 图表。

<Callout type="tip" title="提示">
  MDX 文件中可以直接使用内置组件。
</Callout>
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 样式 | Tailwind CSS 4 + shadcn/ui |
| MDX 编译 | next-mdx-remote |
| 语法高亮 | Shiki (rehype-pretty-code) |
| 数学公式 | KaTeX (remark-math + rehype-katex) |
| 图表 | Mermaid |
| 暗色模式 | next-themes |

## 许可证

Private
