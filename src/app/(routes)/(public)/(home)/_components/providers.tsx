"use client";

import { ChevronLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { ProvidersCard, ProvidersSectionSkeleton } from "@/components/providers";

import { useGetData } from "@/hooks/useFetch";

import { HomeSchema } from "@/schemas/home";

export const ProvidersSection = () => {
  const isAr = useLocale() === "ar";
  const t = useTranslations("home.providers");
  const ProviderSchema = HomeSchema.pick({ providers: true });
  const endpoint = "/home";
  const { data, isLoading } = useGetData<z.infer<typeof ProviderSchema>>({ endpoint, config: {} });
  const providers = data?.status === "success" ? data.response.providers.slice(0, 4) : [];

  if (isLoading) return <ProvidersSectionSkeleton isAr={isAr} />;
  return (
    <section className="pt-20">
      <div className="container space-y-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <h2 className="font-semibold text-3xl">{t("header.title")}</h2>
          <Link href="/providers" className="text-primaryClr flex items-center">
            <span className="whitespace-nowrap">{t("header.more")}</span>
            <ChevronLeft className={cn(isAr ? "rotate-0" : "rotate-180")} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 gap-y-6">
          {providers.map((provider) => (
            <ProvidersCard key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </section>
  );
};
