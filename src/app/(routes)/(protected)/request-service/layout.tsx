import { getTranslations } from "next-intl/server";

import { HeaderBreadcrumb } from "@/components/header-breadcrumb";

export default async function RequestServiceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = await getTranslations("service_req");

  return (
    <div className="mt-20">
      <HeaderBreadcrumb
        itemsList={[
          { value: t("pagination.home"), link: "/" },
          { value: t("pagination.service_req"), link: "/request-service" },
        ]}
      />
      {children}
    </div>
  );
}
