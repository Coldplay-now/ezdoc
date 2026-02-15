import { defineConfig } from "./src/lib/config";

export default defineConfig({
  site: {
    title: "ezdoc",
    description: "基于 Git 仓库的文档管理与渲染系统",
    url: "https://coldplay-now.github.io/ezdoc",
    favicon: "/favicon.ico",
    socials: {
      github: "https://github.com/Coldplay-now/ezdoc",
    },
  },

  docs: {
    dir: "docs",
    nav: "docs.json",
  },

  theme: {
    defaultMode: "system",
    primaryColor: "#3b82f6",
  },

  i18n: {
    defaultLocale: "zh",
    locales: ["zh"],
  },

  deploy: {
    basePath: "",
    output: "out",
  },
});
