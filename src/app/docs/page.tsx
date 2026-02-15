import { redirect } from "next/navigation";
import { getDefaultLocale } from "@/lib/docs";
import { getNavigation } from "@/lib/docs";

/**
 * /docs → redirect to /docs/{defaultLocale}/{firstPage}
 */
export default function DocsIndexPage() {
  const locale = getDefaultLocale();
  const navigation = getNavigation(locale);

  let firstDocPath = "getting-started";
  if (navigation.length > 0 && navigation[0].pages.length > 0) {
    firstDocPath = navigation[0].pages[0].path;
  }

  redirect(`/docs/${locale}/${firstDocPath}`);
}
