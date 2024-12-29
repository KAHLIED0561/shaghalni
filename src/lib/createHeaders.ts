import cookieClient from "js-cookie";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

import { COOKIE_NAME, SESSION_NAME } from "@/constant";

export function createHeaders(cookieStore?: ReadonlyRequestCookies | undefined) {
  let lang = "ar";
  let session = "";
  if (cookieStore) {
    lang = cookieStore.get(COOKIE_NAME)?.value || "ar";
    session = cookieStore.get(SESSION_NAME)?.value || "";
  } else {
    lang = cookieClient.get(COOKIE_NAME) || "ar";
    session = cookieClient.get(SESSION_NAME) || "";
  }

  return {
    "Accept-Language": lang,
    lang,
    Authorization: session ? `Bearer ${session}` : "",
  };
}
