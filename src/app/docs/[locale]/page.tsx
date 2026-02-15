import { redirect } from "next/navigation";
import { getNavigation, getAllLocales } from "@/lib/docs";

export function generateStaticParams() {
  return getAllLocales().map((locale) => ({ locale }));
}

/**
 * /docs/{locale} → redirect to /docs/{locale}/{firstPage}
 */
export default async function LocaleDocsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const navigation = getNavigation(locale);

  let firstDocPath = "getting-started";
  if (navigation.length > 0 && navigation[0].pages.length > 0) {
    firstDocPath = navigation[0].pages[0].path;
  }

  redirect(`/docs/${locale}/${firstDocPath}`);
}
