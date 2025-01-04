"use client";

import { useTranslations } from "next-intl";

import { createHeaders } from "@/lib/createHeaders";
import type { FetchData } from "@/lib/request";

import { useGetData } from "@/hooks/useFetch";

export const AddTransaction = () => {
  const t = useTranslations("profile.balance");

  const headers = createHeaders();
  const endpoint = "/profile";
  const props: FetchData = { endpoint, config: { headers } };
  const { status, data } = useGetData(props);

  if (status === "pending" || status === "error" || data?.status === "fail") return null;

  return (
    <section className="bg-secondaryClr rounded-2.5xl container py-8 flex flex-col sm:flex-row sm:items-center gap-y-6 gap-4 justify-between">
      <h2 className="text-white text-center sm:text-start font-semibold text-4xl">{t("header")}</h2>
      {/* <MoyasarPayment amount={1} financialTransferId={0} className="px-8 py-1.5" title={t("btn")} /> */}
    </section>
  );
};
