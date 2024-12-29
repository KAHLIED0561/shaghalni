"use client";

import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserButtonSheet } from "@/components/user-button/sheet";

import logoDarkEn from "@/assets/images/logo-dark-en.svg";
import logoDarkAr from "@/assets/images/logo-dark.svg";

import { LanguageChanger } from "./language";
import { logoutAction } from "@/actions/logout";

type NavbarSheetProps = {
  isLogged: boolean;
};

export const NavSheet = ({ isLogged }: NavbarSheetProps) => {
  const locale = useLocale();
  const t = useTranslations("main");
  const navT = useTranslations("navbar");
  const [open, setOpen] = useState(false);

  const isAr = locale === "ar";

  const handleOpen = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Sheet onOpenChange={handleOpen} open={open}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 font-medium" type="button">
          <Menu className="size-6" />
        </button>
      </SheetTrigger>
      <SheetContent side={isAr ? "right" : "left"} className="px-0">
        <SheetHeader className="my-6 px-4">
          <Image src={isAr ? logoDarkAr : logoDarkEn} alt={t("title")} width={140} />
          <SheetTitle className="sr-only">{t("title")}</SheetTitle>
          <SheetDescription className="text-start">{t("description")}</SheetDescription>
        </SheetHeader>
        <ScrollArea dir={isAr ? "rtl" : "ltr"} className="w-full h-[calc(100vh-173.5px)]">
          <div className={cn("flex flex-col text-lg", isAr ? "font-cairo" : "font-chillax")}>
            <div className="font-medium flex flex-col items-start gap-4">
              {!isLogged && (
                <div className="px-4">
                  <Link
                    href="/register"
                    className="block text-white bg-primaryClr-600 transition-colors hover:bg-primaryClr-500 rounded-md px-6 py-2.5"
                  >
                    {navT("signup")}
                  </Link>
                </div>
              )}
              {isLogged && <UserButtonSheet />}
              <ul className="w-full px-2">
                {!isLogged && (
                  <li className="w-full">
                    <Link
                      href="/sign-in"
                      className="block text-start w-full text-gray-600 font-medium py-2 px-2 rounded-md transition-colors hover:bg-gray-100"
                    >
                      {navT("signin")}
                    </Link>
                  </li>
                )}
                {isLogged && (
                  <>
                    <li className="w-full">
                      <Link
                        href="/chat"
                        onClick={() => setOpen(false)}
                        className="block text-start w-full text-gray-600 font-medium py-2 px-2 rounded-md transition-colors hover:bg-gray-100"
                      >
                        {navT("chat")}
                      </Link>
                    </li>

                    <li className="w-full">
                      <Link
                        href="/request-service"
                        onClick={() => setOpen(false)}
                        className="block text-start w-full text-gray-600 font-medium py-2 px-2 rounded-md transition-colors hover:bg-gray-100"
                      >
                        {navT("request_service")}
                      </Link>
                    </li>
                  </>
                )}
                <li className="w-full">
                  <Link
                    href="/providers"
                    onClick={() => setOpen(false)}
                    className="block text-start w-full text-gray-600 font-medium py-2 px-2 rounded-md transition-colors hover:bg-gray-100"
                  >
                    {navT("providers")}
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    href="/projects"
                    onClick={() => setOpen(false)}
                    className="block text-start w-full text-gray-600 font-medium py-2 px-2 rounded-md transition-colors hover:bg-gray-100"
                  >
                    {navT("projects")}
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    href="/blogs"
                    onClick={() => setOpen(false)}
                    className="block text-start w-full text-gray-600 font-medium py-2 px-2 rounded-md transition-colors hover:bg-gray-100"
                  >
                    {navT("blogs")}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mt-6 px-2 space-y-3">
              <h3 className="px-2 font-bold">{navT("general")}</h3>
              <div>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="block text-start w-full text-gray-600 font-medium py-2 px-2 rounded-md transition-colors hover:bg-gray-100"
                >
                  {navT("home")}
                </Link>
                {isLogged && (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="block text-start w-full text-gray-600 font-medium py-2 px-2 rounded-md transition-colors hover:bg-gray-100"
                    >
                      {navT("profile")}
                    </Link>
                    <Link
                      href="/billing"
                      onClick={() => setOpen(false)}
                      className="block text-start w-full text-gray-600 font-medium py-2 px-2 rounded-md transition-colors hover:bg-gray-100"
                    >
                      {navT("billing")}
                    </Link>
                  </>
                )}
                <LanguageChanger />
                <Link
                  href="/support"
                  onClick={() => setOpen(false)}
                  className="block text-start w-full text-gray-600 font-medium py-2 px-2 rounded-md transition-colors hover:bg-gray-100"
                >
                  {navT("support")}
                </Link>
                {isLogged && (
                  <button
                    onClick={async () => {
                      await logoutAction();
                    }}
                    className="block text-start w-full text-rose-500 font-medium py-2 px-2 rounded-md transition-colors hover:bg-gray-100"
                  >
                    {navT("logout")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
