import { getNavigation } from "@/lib/docs";
import ezdocConfig from "@config";
import { DocsLayoutShell } from "@/components/layout/docs-layout-shell";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = getNavigation();
  const siteTitle = ezdocConfig.site.title;
  const githubUrl = ezdocConfig.site.socials?.github;

  return (
    <DocsLayoutShell
      siteTitle={siteTitle}
      githubUrl={githubUrl}
      navigation={navigation}
    >
      {children}
    </DocsLayoutShell>
  );
}
