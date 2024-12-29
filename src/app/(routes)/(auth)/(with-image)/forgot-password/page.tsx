import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Logo } from "@/components/auth/logo";

export async function generateMetadata() {
  const t = await getTranslations("auth.forgot_password");

  const metadata: Metadata = {
    title: t("page_title"),
    description: t("meta_description"),
  };

  return metadata;
}

export default async function forgotPasswordPage() {
  const t = await getTranslations("auth.forgot_password");

  return (
    <div className="flex flex-col 4xl:justify-center 4xl:gap-12 h-full container">
      <div className="pt-8">
        <Logo />
      </div>
      <div className="flex-grow 4xl:flex-grow-0 flex items-center justify-center md:justify-start">
        <div className="max-w-[28rem] w-full">
          <div className="space-y-2 3xl:space-y-4">
            <h1 className="text-4xl font-bold">{t("title")}</h1>
            <p className="text-garyClr 3xl:text-xl">{t("subtitle")}</p>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
