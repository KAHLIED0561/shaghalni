"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { cn } from "@/lib/utils";

import type { Locale } from "@/i18n/config";
import { setUserLocale } from "@/services/localeClient";

export const LanguageChanger = () => {
  const locale = useLocale();
  const t = useTranslations("locals");
  const [open, setOpen] = useState(false);

  const localesList = [
    { locale: "ar", label: t("arabic") },
    { locale: "en", label: t("english") },
  ];

  const onLocaleChange = (locale: string) => {
    setUserLocale(locale as Locale);
    window.location.reload();
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex text-start items-center justify-between w-full text-gray-600 font-medium py-2 px-2 rounded-md transition-colors hover:bg-gray-100"
      >
        <span className="flex items-center gap-2">
          <span>{t("change_language")}</span>
          <Globe className="inline-block size-5" />
        </span>
        <ChevronDown className={cn("inline-block ml-2 transition-transform", open ? "rotate-180" : "rotate-0")} />
      </button>
      <div className={cn("overflow-hidden transition-all", open ? "h-[88px]" : "h-0")}>
        <ul>
          {localesList.map((item) => (
            <li key={item.locale}>
              <button
                type="button"
                onClick={() => onLocaleChange(item.locale)}
                className="py-2 w-full hover:bg-gray-100 text-gray-600 font-medium text-start rounded-md transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Check className={cn("size-4", locale === item.locale ? "text-garyClr" : "text-transparent")} />
                  <span>{item.label}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
