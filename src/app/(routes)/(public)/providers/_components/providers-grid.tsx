"use client";

import { useTranslations } from "next-intl";
import { parseAsString, useQueryStates } from "nuqs";
import omitEmpty from "omit-empty";

import { ProvidersCard } from "@/components/providers/card";

import { useGetData } from "@/hooks/useFetch";

import { ProviderResType } from "@/schemas/providers";

export function ProvidersSection() {
  const t = useTranslations("provider");
  const [{ page, name, cityId, facilityTypeId, serviceId, serviceTypeId }] = useQueryStates({
    page: parseAsString.withDefault("1"),
    name: parseAsString.withDefault(""),
    cityId: parseAsString.withDefault(""),
    serviceTypeId: parseAsString.withDefault(""),
    facilityTypeId: parseAsString.withDefault(""),
    serviceId: parseAsString.withDefault(""),
  });
  const endpoint = "/providers/search";
  const queryParams = omitEmpty({ page, name, cityId, serviceTypeId, facilityTypeId, serviceId });
  const { data, isLoading } = useGetData<ProviderResType>({
    endpoint,
    config: { queryParams },
  });
  const providers = data?.status === "success" ? data.response.providers : [];

  if (isLoading) return null;
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
      {providers?.length === 0 && (
        <h2 className="col-span-1 xs:col-span-2 sm:col-span-3 lg:col-span-4 text-2xl font-bold text-center">
          {t("no_providers")}
        </h2>
      )}
      {providers && providers.map((provider) => <ProvidersCard key={provider.id} provider={provider} />)}
    </div>
  );
}
