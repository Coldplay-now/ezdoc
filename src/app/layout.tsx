import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ezdocConfig from "@config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: ezdocConfig.site.title,
  description: ezdocConfig.site.description ?? "Documentation powered by ezdoc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const defaultTheme = ezdocConfig.theme?.defaultMode ?? "system";
  const locale = ezdocConfig.i18n?.defaultLocale ?? "zh";

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme={defaultTheme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
