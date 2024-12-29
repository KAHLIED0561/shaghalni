"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { EMAIL_ADDRESS, PASSWORD_RESET } from "@/constant";

export const resetPassAction = async (session: string) => {
  // set the session cookie
  const cookieSession = cookies();
  cookieSession.set(PASSWORD_RESET, session, {
    path: "/",
    value: session,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  // Remove the email cookie if it exists
  if (cookies().get(EMAIL_ADDRESS)) {
    cookies().delete(EMAIL_ADDRESS);
  }

  // Redirect to the callback URL if provided, otherwise to the default redirect
  const redirectUrl = "/new-password";
  redirect(redirectUrl);
};
