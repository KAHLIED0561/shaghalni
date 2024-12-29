"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { decodeSession } from "@/lib/session";

import { DEFAULT_LOGIN_REDIRECT, EMAIL_ADDRESS, SESSION_NAME } from "@/constant";

export const loginAction = async (session: string, remeber: boolean = false, callbackUrl?: string | null) => {
  // get the exp value from the session
  const { exp } = decodeSession(session);

  // set the session cookie
  const cookieSession = cookies();

  // if remember is false, set the session cookie to expire to session cookie
  cookieSession.set(SESSION_NAME, session, {
    path: "/",
    expires: remeber ? new Date(exp * 1000) : undefined,
    value: session,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  // Remove the email cookie if it exists
  if (cookies().get(EMAIL_ADDRESS)) {
    cookies().delete(EMAIL_ADDRESS);
  }

  // Redirect to the callback URL if provided, otherwise to the default redirect
  const redirectUrl = callbackUrl || DEFAULT_LOGIN_REDIRECT;
  redirect(redirectUrl);
};
