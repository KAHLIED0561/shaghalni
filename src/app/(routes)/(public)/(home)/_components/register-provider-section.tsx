import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import bgImage from "@/assets/images/service-provider.webp";

export const RegisterProviderSection = async () => {
  const locale = await getLocale();
  const t = await getTranslations("home.register_provider");

  const isAr = locale === "ar";

  return (
    <section className="pt-20 container">
      <div className="relative rounded-2.5xl overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src={bgImage}
            alt={t("image")}
            width={800}
            loading="lazy"
            className="w-full h-full xs:h-auto object-cover"
          />
        </div>
        <div
          className={cn(
            "absolute inset-0 from-black/80 to-primaryClr-900/70 -z-10",
            isAr ? "bg-gradient-to-r" : "bg-gradient-to-l"
          )}
        />
        <div className="flex flex-col items-center sm:flex-row sm:items-center justify-between gap-4 p-6">
          <h2 className="text-white font-medium text-3xl text-center text-pretty sm:text-start">{t("title")}</h2>
          <Link
            href="/register/provider"
            className="text-white font-medium bg-primaryClr px-6 py-3 rounded-2.5xl transition-colors hover:bg-primaryClr-500 whitespace-nowrap"
          >
            {t("button")}
          </Link>
        </div>
      </div>
    </section>
  );
};
