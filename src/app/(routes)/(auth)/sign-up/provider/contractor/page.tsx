import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { EngineeringContractorForm } from "@/components/auth/engineering-contractor-form";

export async function generateMetadata() {
  const t = await getTranslations("auth.register.engineering_contractor");

  const metadata: Metadata = {
    title: t("page_title"),
    description: t("meta_description"),
  };

  return metadata;
}

export default async function ContractorSignUpPage() {
  const t = await getTranslations("auth.register.engineering_contractor");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-semibold text-4xl">{t("title")}</h1>
        <p className="text-garyClr">{t("subtitle")}</p>
      </div>
      <EngineeringContractorForm type="CONTRACTOR" />
    </div>
  );
}
