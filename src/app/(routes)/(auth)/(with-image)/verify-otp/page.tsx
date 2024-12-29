import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Logo } from "@/components/auth/logo";
import { VerifyOtpForm } from "@/components/auth/verify-otp-form";

export async function generateMetadata() {
  const t = await getTranslations("auth.verify_otp");

  const metadata: Metadata = {
    title: t("page_title"),
    description: t("meta_description"),
  };

  return metadata;
}

export default async function VerifyOtpPage() {
  const t = await getTranslations("auth.verify_otp");

  return (
    <div className="flex flex-col items-center md:items-start 4xl:justify-center 4xl:gap-12 h-full container">
      <div className="pt-8">
        <Logo />
      </div>
      <div className="flex-grow 4xl:flex-grow-0 flex items-center justify-center md:justify-start">
        <div className="max-w-[28rem] w-full flex flex-col items-center md:items-start text-center md:text-start">
          <div className="space-y-2 3xl:space-y-4">
            <h1 className="text-4xl font-bold">{t("title")}</h1>
            <p className="text-garyClr 3xl:text-xl">{t("subtitle")}</p>
          </div>
          <VerifyOtpForm />
        </div>
      </div>
    </div>
  );
}
