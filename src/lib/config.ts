export interface SiteConfig {
  title: string;
  description?: string;
  logo?: string;
  favicon?: string;
  url?: string;
  socials?: Record<string, string>;
}

export interface DocsConfig {
  dir?: string;
  nav?: string;
}

export interface ThemeConfig {
  defaultMode?: "light" | "dark" | "system";
  primaryColor?: string;
  accentColor?: string;
}

export interface I18nConfig {
  defaultLocale?: string;
  locales?: string[];
}

export interface VersionsConfig {
  current?: string;
  list?: string[];
}

export interface DeployConfig {
  basePath?: string;
  output?: string;
}

export interface EzdocConfig {
  site: SiteConfig;
  docs?: DocsConfig;
  theme?: ThemeConfig;
  i18n?: I18nConfig;
  versions?: VersionsConfig;
  deploy?: DeployConfig;
}

const defaults: Omit<Required<EzdocConfig>, "site"> & { site: SiteConfig } = {
  site: { title: "ezdoc" },
  docs: { dir: "docs", nav: "docs.json" },
  theme: { defaultMode: "system", primaryColor: "#3b82f6" },
  i18n: { defaultLocale: "zh", locales: ["zh"] },
  versions: { current: undefined, list: [] },
  deploy: { basePath: "", output: "out" },
};

export function defineConfig(config: EzdocConfig): Required<EzdocConfig> {
  return {
    site: { ...defaults.site, ...config.site },
    docs: { ...defaults.docs, ...config.docs },
    theme: { ...defaults.theme, ...config.theme },
    i18n: { ...defaults.i18n, ...config.i18n },
    versions: { ...defaults.versions, ...config.versions },
    deploy: { ...defaults.deploy, ...config.deploy },
  } as Required<EzdocConfig>;
}

let _config: Required<EzdocConfig> | null = null;

export async function loadConfig(): Promise<Required<EzdocConfig>> {
  if (_config) return _config;

  try {
    const mod = await import("@config");
    _config = mod.default;
  } catch {
    _config = defineConfig({ site: { title: "ezdoc" } });
  }

  return _config;
}

export function getBasePath(): string {
  return process.env.EZDOC_BASE_PATH ?? "";
}
