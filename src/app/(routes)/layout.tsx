import "../globals.css";
import type { Metadata } from "next";
import { useLocale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/sonner";

import { FontProvider, I18nProvider, ModalProvider, QueryProvider, SearchParamsProvider } from "@/providers";

export async function generateMetadata() {
  const t = await getTranslations("main");
  const locale = await getLocale();

  const title = t("title");
  const description = t("description");

  // const image = new URL("/shaghalni-ar.jpg", import.meta.url);
  const imageUrl = locale === "ar" ? "/shaghalni-ar.jpg" : "/shaghalni-en.jpg";
  // check if production
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction ? "https://shaghalni.sa" : "http://localhost:3000";
  const metadataBase = new URL(baseUrl);

  const metadata: Metadata = {
    metadataBase,
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
    },
  };

  return metadata;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = useLocale();
  const lang = locale === "ar" ? { dir: "rtl", isAr: true } : { dir: "ltr", isAr: false };

  return (
    <html lang={locale} dir={lang.dir}>
      <FontProvider>
        <QueryProvider>
          <I18nProvider>
            <SearchParamsProvider>
              <div className={cn(lang.isAr ? "font-cairo" : "font-chillax")}>
                <ModalProvider />
                {children}
                <Toaster richColors theme="light" position="bottom-center" />
              </div>
            </SearchParamsProvider>
          </I18nProvider>
        </QueryProvider>
      </FontProvider>
    </html>
  );
}
