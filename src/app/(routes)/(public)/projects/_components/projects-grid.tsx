"use client";

import { useTranslations } from "next-intl";
import { parseAsString, useQueryStates } from "nuqs";
import omitEmpty from "omit-empty";

import { ProjectCard } from "@/components/projects";
import { ProjectsSectionSkeleton } from "@/components/projects/skeleton-grid";

import { useGetData } from "@/hooks/useFetch";

import { ProjectRes } from "@/schemas/project";

export function ProjectsSection() {
  const t = useTranslations("projects");
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
  const { data, isLoading } = useGetData<ProjectRes>({
    endpoint,
    config: { queryParams },
  });
  const projects = data?.status === "success" ? data.response.formattedRequests : null;

  if (isLoading) return <ProjectsSectionSkeleton withHeader={false} />;
  return (
    <div className="grid gap-4 mb-10">
      {projects?.length === 0 && <h2 className="text-2xl font-bold text-center">{t("no_projects")}</h2>}
      {projects && projects.map((project) => <ProjectCard key={project.id} project={{ ...project }} />)}
    </div>
  );
}
