import { getTranslations } from "next-intl/server";

import { RequestType } from "@/constant";

export const mapServiceTypes = async () => {
  const t = await getTranslations("provider.search.providers");
  const serviceTypes = [
    { id: RequestType.TECHNICIAN, option: t("0") },
    { id: RequestType.CONTRACTOR, option: t("1") },
    { id: RequestType.DESIGNER, option: t("2") },
    { id: RequestType.ENGINEERING, option: t("3") },
    { id: RequestType.DESIGNER, option: t("4") },
  ];
  return serviceTypes;
};
