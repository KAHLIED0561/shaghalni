"use client";

import { NotificationButton } from "../notification-button";
import { MessageCircleMoreIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

import { LanguageChanger } from "@/components/language-changer";
import { UserButton } from "@/components/user-button";

import { useGetData } from "@/hooks/useFetch";

import logoWhiteEn from "@/assets/images/logo-white-en.svg";
import logoWhiteAr from "@/assets/images/logo-white.svg";

import { NavSheet } from "./navSheet";
import { CurrentUserSchema } from "@/schemas/user";

type NavbarContainerProps = {
  isLogged: boolean;
};

export const NavbarContainer = ({ isLogged }: NavbarContainerProps) => {
  const locale = useLocale();
  const t = useTranslations("home");
  const navT = useTranslations("navbar");

  const endpoint = "/auth/current-user";
  const { data, isLoading } = useGetData<z.infer<typeof CurrentUserSchema>>({ endpoint, config: {} });
  const currentUserData = data?.status === "success" ? data.response : null;

  const isAr = locale === "ar";

  return (
    <nav className="bg-secondaryClr-600 text-white fixed w-full start-0 top-0 z-40 h-20">
      <div className="container py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <div>
            <Link href="/">
              <Image src={isAr ? logoWhiteAr : logoWhiteEn} alt={t("page_title")} width={140} />
            </Link>
          </div>
          <ul className="hidden md:flex items-center gap-3 font-medium">
            <li>
              <Link href="/">{navT("home")}</Link>
            </li>
            <li>
              <Link href="/providers">{navT("providers")}</Link>
            </li>
            <li>
              <Link href="/projects">{navT("projects")}</Link>
            </li>
            <li>
              <Link href="/blogs">{navT("blogs")}</Link>
            </li>
            <li>
              <Link href="/contact">{navT("contact")}</Link>
            </li>
          </ul>
        </div>
        <div className="items-center gap-4 hidden lg:flex">
          <LanguageChanger />
          {isLoading ? null : <div className="h-6 w-[1px] bg-white"></div>}
          {isLoading ? null : isLogged && currentUserData ? (
            <div className="flex items-center gap-4">
              <UserButton lang={locale} {...currentUserData} />
              <NotificationButton />
              <Link href="/chat">
                <MessageCircleMoreIcon size={24} />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 font-medium">
              <Link href="/sign-in" className="text-primaryClr-600">
                {navT("signin")}
              </Link>
              <Link
                href="/register"
                className="text-white bg-primaryClr-600 transition-colors hover:bg-primaryClr-500 rounded-2.5xl px-6 py-2.5"
              >
                {navT("signup")}
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 lg:hidden">
          {isLogged && currentUserData && <NotificationButton />}
          <NavSheet isLogged={isLogged} />
        </div>
      </div>
    </nav>
  );
};
