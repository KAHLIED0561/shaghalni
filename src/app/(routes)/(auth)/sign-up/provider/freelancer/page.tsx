import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { FreelancerForm } from "@/components/auth/freelancer-form";

export async function generateMetadata() {
  const t = await getTranslations("auth.register.freelancer");

  const metadata: Metadata = {
    title: t("page_title"),
    description: t("meta_description"),
  };

  return metadata;
}

export default async function FreelancerSignUpPage() {
  const t = await getTranslations("auth.register.freelancer");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-semibold text-4xl">{t("title")}</h1>
        <p className="text-garyClr">{t("subtitle")}</p>
      </div>
      <FreelancerForm />
    </div>
  );
}
