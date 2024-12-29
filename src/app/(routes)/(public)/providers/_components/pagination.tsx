"use client";

import { parseAsString, useQueryStates } from "nuqs";
import omitEmpty from "omit-empty";

import PagePagination from "@/components/pagination/pagePagination";

import { useGetData } from "@/hooks/useFetch";

import { ProviderResType } from "@/schemas/providers";

export function ProvidersPagination() {
  const [{ name, cityId, facilityTypeId, serviceId, serviceTypeId }] = useQueryStates({
    name: parseAsString.withDefault(""),
    cityId: parseAsString.withDefault(""),
    serviceTypeId: parseAsString.withDefault(""),
    facilityTypeId: parseAsString.withDefault(""),
    serviceId: parseAsString.withDefault(""),
  });
  const endpoint = "/providers/search";
  const queryParams = omitEmpty({ name, cityId, serviceTypeId, facilityTypeId, serviceId });
  const { data, status: reqStatus } = useGetData<ProviderResType>({
    endpoint,
    config: { queryParams },
  });
  const num = data?.status === "success" ? data.response.total : 0;
  const pages = Math.ceil(num / 12);

  if (reqStatus !== "success" || pages === 0) return null;
  return <PagePagination numberOfPages={pages} />;
}
