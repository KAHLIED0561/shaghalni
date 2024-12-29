"use client";

import cookies from "js-cookie";

import { COOKIE_NAME } from "@/constant";
import { Locale } from "@/i18n/config";

export async function setUserLocale(locale: Locale) {
  // Set the cookie to expire in 1 year (365 days)
  const oneYear = 365 * 24 * 60 * 60 * 1000; // 365 days in milliseconds
  const expirationDate = new Date(Date.now() + oneYear);

  cookies.set(COOKIE_NAME, locale, {
    expires: expirationDate,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}
