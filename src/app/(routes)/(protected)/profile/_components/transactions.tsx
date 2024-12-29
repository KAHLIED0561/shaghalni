"use client";

import { ChevronLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { createHeaders } from "@/lib/createHeaders";
import { FetchData } from "@/lib/request";
import { cn } from "@/lib/utils";

import { TransactionItem } from "@/components/profile/transaction-item";

import { useGetData } from "@/hooks/useFetch";

import { Profile } from "@/schemas/user";

export const Transactions = () => {
  const t = useTranslations("profile.latestTransfers");
  const isAr = useLocale() === "ar";

  const headers = createHeaders();
  const endpoint = "/profile";
  const props: FetchData = { endpoint, config: { headers } };
  const { data, isLoading } = useGetData<Profile>(props);
  const transactions = data?.status === "success" ? data.response.transactions : null;
  const isEmpty = transactions?.length === 0;

  if (isLoading || !transactions) return null;
  return (
    <section className="py-20 pb-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <h2 className="text-4xl font-semibold">{t("header")}</h2>
        {!isEmpty && (
          <Link href="/profile/transactions" className="flex items-center gap-1 text-primaryClr">
            <span>{t("showMoreBtn")}</span>
            <ChevronLeft className={cn("size-5", isAr ? "rotate-0" : "rotate-180")} />
          </Link>
        )}
      </div>
      {isEmpty && (
        <div className="text-center flex items-center justify-center py-5">
          <p>{t("no_transfers")}</p>
        </div>
      )}
      {!isEmpty && (
        <ul className="bg-gray-100 rounded-2.5xl py-5 border border-gray-300 container space-y-6">
          {transactions.map((transaction) => {
            return <TransactionItem key={transaction.id} {...transaction} />;
          })}
        </ul>
      )}
    </section>
  );
};
