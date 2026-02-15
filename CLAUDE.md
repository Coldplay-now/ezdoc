- 始终使用中文与用户交互

## 项目概述

ezdoc 是一个基于 Git 仓库的文档管理与渲染系统。用户在 Git 仓库中以 Markdown / MDX 格式编写文档，系统在构建时编译为纯静态站点。

- 项目性质：私有
- 仓库地址：git@github.com:Coldplay-now/ezdoc.git

## 技术栈

- 框架：Next.js (App Router)，纯静态导出 (`output: 'export'`)
- 语言：TypeScript
- 样式：Tailwind CSS + shadcn/ui (Radix UI)
- MDX 编译：next-mdx-remote
- 语法高亮：Shiki (rehype-pretty-code)
- 数学公式：remark-math + rehype-katex
- 图表：Mermaid.js（客户端渲染，next/dynamic + ssr: false）
- 图片处理：构建时 sharp 预处理（纯静态导出不支持 next/image 服务端优化）
- 搜索：Pagefind（构建后生成索引）
- 多语言：next-intl
- 暗色模式：next-themes
- 包管理器：pnpm
- Node.js：v20 LTS
- CI/CD：GitHub Actions 双 workflow（GitHub Pages + 自有服务器）

## 架构决策

- 一体化架构：编译引擎和前端站点在同一个 Next.js 项目中，不拆分
- 不使用 Fumadocs 等文档框架，全自研组装 remark/rehype 插件链路
- 导航结构：docs.json 配置优先 + 目录扫描回退
- 配置入口：`ezdoc.config.ts` 集中管理所有配置项
- 部署：纯静态文件部署到 Nginx，无需 Node.js 运行时

## UI 风格参考

参考 Claude API Docs (platform.claude.com/docs) 风格：
- 干净简洁的三栏布局
- 内容区域宽敞
- 组件：Note 提示框、CardGroup 卡片网格、Tooltip 悬浮提示、可折叠 section
- 表格样式清晰，代码块突出

## 关键文件

- `docs/PRD.md` — 产品需求文档
- `docs/deployment.md` — 部署关注点文档
- `docs/tasks.md` — 项目 Task 计划
- `ezdoc.config.ts` — 项目配置文件（待创建）
- `src/lib/config.ts` — 配置加载与类型定义（待创建）
- `src/lib/mdx.ts` — MDX 编译逻辑（待创建）
- `src/lib/docs.ts` — 文档读取与导航生成（待创建）

## 开发命令

- `pnpm dev` — 本地开发
- `pnpm build` — 构建静态产物到 out/
- `pnpm lint` — 代码检查
