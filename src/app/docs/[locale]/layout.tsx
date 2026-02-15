import { getNavigation, getAllLocales } from "@/lib/docs";
import ezdocConfig from "@config";
import { DocsLayoutShell } from "@/components/layout/docs-layout-shell";

export function generateStaticParams() {
  return getAllLocales().map((locale) => ({ locale }));
}

export default async function LocaleDocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const navigation = getNavigation(locale);
  const siteTitle = ezdocConfig.site.title;
  const githubUrl = ezdocConfig.site.socials?.github;
  const locales = ezdocConfig.i18n?.locales ?? [{ code: "zh", label: "中文" }];

  return (
    <DocsLayoutShell
      siteTitle={siteTitle}
      githubUrl={githubUrl}
      navigation={navigation}
      locale={locale}
      locales={locales}
    >
      {children}
    </DocsLayoutShell>
  );
}
