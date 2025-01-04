import { Mail, MapPin, Phone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

import logoWhiteEn from "@/assets/images/logo-white-en.svg";
import logoWhiteAr from "@/assets/images/logo-white.svg";

export const Footer = async () => {
  const locale = await getLocale();
  const t = await getTranslations("footer");

  const isAr = locale === "ar";

  return (
    <footer className="w-full bg-secondaryClr pt-16 pb-8 text-white font-medium">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 border-b border-gray-400 pb-8">
          <div className="space-y-2 md:col-span-2 lg:col-span-1">
            <Image src={isAr ? logoWhiteAr : logoWhiteEn} alt={t("logo")} width={180} />
            <span className="block max-w-xs text-balance">{t("subtitle")}</span>
          </div>

          <ul className="space-y-2">
            <li>
              <Link href="/providers" className="hover:underline">
                {t("col1.providers")}
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:underline">
                {t("col1.projects")}
              </Link>
            </li>
            <li>
              <Link href="/blogs" className="hover:underline">
                {t("col1.blogs")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                {t("col1.contact")}
              </Link>
            </li>
          </ul>

          <ul className="space-y-2">
            <li>
              <Link href="/terms-conditions" className="hover:underline">
                {t("col2.rules")}
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:underline">
                {t("col2.privacy")}
              </Link>
            </li>
            <li>
              <Link href="/who-are-we" className="hover:underline">
                {t("col2.who")}
              </Link>
            </li>
          </ul>

          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="bg-white/20 p-2 w-fit rounded-full" title={t("col3.phone")}>
                <Phone className="size-4 fill-white" />
              </div>
              <Link
                href={`https://wa.me/${t("col3.phone")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                0123456789
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <div className="bg-white/20 p-2 w-fit rounded-full" title={t("col3.email")}>
                <Mail className="size-4" />
              </div>
              <Link
                href="mailto:info@shaghalni.sa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                info@shaghalni.sa
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <div className="bg-white/20 p-2 w-fit rounded-full" title={t("col3.location")}>
                <MapPin className="size-4" />
              </div>
              <p className="hover:underline">{t("col3.location_value")}</p>
            </li>
          </ul>
        </div>

        <div className="md:text-center pt-6 text-pretty">
          <p>{t("copy_right")}</p>
        </div>
      </div>
    </footer>
  );
};
