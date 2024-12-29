"use server";

import { cookies } from "next/headers";

import { COOKIE_NAME } from "@/constant";
import { Locale, defaultLocale, locales } from "@/i18n/config";

export async function getUserLocale() {
  // First, check if there's a cookie set
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get(COOKIE_NAME)?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // If no cookie, try to get the locale from the Next.js headers
  // const headersList = headers();
  // const lang = headersList.get("accept-language")?.split(",")[0].split("-")[0];
  // if (lang && locales.includes(lang as Locale)) {
  //   return lang as Locale;
  // }

  // If no locale found, return the default locale
  return defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  // Set the cookie to expire in 1 year (365 days)
  const oneYear = 365 * 24 * 60 * 60 * 1000; // 365 days in milliseconds
  const expirationDate = new Date(Date.now() + oneYear);

  cookies().set(COOKIE_NAME, locale, {
    expires: expirationDate,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}
