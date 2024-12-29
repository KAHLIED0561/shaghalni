"use client";

import { parseAsString, useQueryStates } from "nuqs";
import omitEmpty from "omit-empty";

import PagePagination from "@/components/pagination/pagePagination";

import { useGetData } from "@/hooks/useFetch";

import { ProjectRes } from "@/schemas/project";

export function ProjectsPagination() {
  const [{ page, title, "service-type": serviceType, locationId, status, publishDate: startDate }] = useQueryStates({
    page: parseAsString.withDefault("1"),
    title: parseAsString.withDefault(""),
    "service-type": parseAsString.withDefault(""),
    locationId: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
    publishDate: parseAsString.withDefault(""),
  });
  const endpoint = "/projects";
  const queryParams = omitEmpty({ page, title, serviceType, locationId, status, startDate });
  const { data, status: reqStatus } = useGetData<ProjectRes>({
    endpoint,
    config: { queryParams },
  });
  const num = data?.status === "success" ? data.response.numberOfProjects : 1;
  const pages = Math.ceil(num / 10);

  if (reqStatus !== "success" || pages === 0) return null;
  return <PagePagination numberOfPages={pages} />;
}
