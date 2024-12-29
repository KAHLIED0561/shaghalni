import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CustomerForm } from "@/components/auth/customer-form";

export async function generateMetadata() {
  const t = await getTranslations("auth.register.personal_account");

  const metadata: Metadata = {
    title: t("page_title"),
    description: t("meta_description"),
  };

  return metadata;
}

export default async function CustomerSignUpPage() {
  const t = await getTranslations("auth.register.personal_account");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-semibold text-4xl">{t("title")}</h1>
        <p className="text-garyClr">{t("subtitle")}</p>
      </div>
      <CustomerForm />
    </div>
  );
}
