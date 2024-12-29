"use client";

import clsx from "clsx";
import { CheckIcon, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

import type { Locale } from "@/i18n/config";
import { setUserLocale } from "@/services/localeClient";

type LanguageChangerProps = {
  defaultLocale: string;
  items: Array<{ locale: string; label: string }>;
};

export const LanguageChangerSelect = ({ defaultLocale, items }: LanguageChangerProps) => {
  const [open, setOpen] = useState(false);
  const isAr = useLocale() === "ar";
  const t = useTranslations("locals");

  const onLanguageChange = (locale: string) => {
    setUserLocale(locale as Locale);
    window.location.reload();
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    // <div className="relative">
    //   <button type="button" onClick={handleOpen} className="flex items-center gap-2 font-medium">
    //     <span>{defaultLocale.toLocaleUpperCase()}</span>
    //     <Globe className="size-5" />
    //   </button>
    //   {open && (
    //     <div className="absolute start-0 top-7 bg-white shadow-lg min-w-32 rounded-md text-black py-2 z-40">
    //       <h3 className="whitespace-nowrap px-4">{t("change_language")}</h3>
    //       <Separator className="my-2" />
    //       <ul>
    //         {items.map(({ label, locale }, i) => (
    //           <li key={i}>
    //             <button
    //               className={clsx("flex px-4 items-center gap-2 w-full py-2 transition-colors hover:bg-gray-100", {
    //                 "text-green-600": defaultLocale === locale,
    //               })}
    //               onClick={() => {
    //                 onLanguageChange(locale);
    //                 setOpen(false);
    //               }}
    //             >
    //               <span className="font-medium">{label}</span>
    //               {defaultLocale === locale && <CheckIcon className="size-5 text-green-600" />}
    //             </button>
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   )}
    // </div>
    <DropdownMenu modal={false} dir={isAr ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <button type="button" onClick={handleOpen} className="flex items-center gap-2 font-medium">
          <span>{defaultLocale.toLocaleUpperCase()}</span>
          <Globe className="size-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="whitespace-nowrap px-4">{t("change_language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {items.map(({ label, locale }, i) => (
            <DropdownMenuItem key={i}>
              <button
                className={clsx("flex p-2 items-center gap-2 w-full transition-colors hover:bg-gray-100", {
                  "text-green-600": defaultLocale === locale,
                })}
                onClick={() => {
                  onLanguageChange(locale);
                  setOpen(false);
                }}
              >
                <span className="font-medium">{label}</span>
                {defaultLocale === locale && <CheckIcon className="size-5 text-green-600" />}
              </button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
