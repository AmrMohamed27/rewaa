import "@/app/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { getPayload } from "@/lib/cms/getPayload";
import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { Toaster } from "sonner";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "300", "200", "100"],
});

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload();
  const siteSettings = await payload.findGlobal({
    slug: "site-settings",
  });

  return {
    metadataBase: siteSettings.siteUrl ? new URL(siteSettings.siteUrl) : undefined,
    title: siteSettings.siteTitle,
    description: siteSettings.siteDescription,
  };
}

/**
 * Root layout component for the main application group.
 * Handles global providers (Theme, Query), fonts, and global UI elements like Toaster.
 *
 * @param props - Component props containing children elements.
 */
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexArabic.variable} ${ibmPlexArabic.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="Rewaa" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
