"use client";

import { ChevronLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { ProjectCard, ProjectsSectionSkeleton } from "@/components/projects";

import { useGetData } from "@/hooks/useFetch";

import { HomeSchema } from "@/schemas/home";

export const ProjectsSection = () => {
  const locale = useLocale();
  const t = useTranslations("home.projects");
  const ProjectsSchema = HomeSchema.pick({ projects: true });
  const endpoint = "/home";
  const { data, isLoading } = useGetData<z.infer<typeof ProjectsSchema>>({ endpoint, config: {} });
  const projects = data?.status === "success" ? data.response.projects.slice(0, 4) : [];

  const isAr = locale === "ar";

  if (isLoading) return <ProjectsSectionSkeleton isAr={isAr} />;
  return (
    <section className="pt-20">
      <div className="container space-y-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <h2 className="font-semibold text-3xl">{t("header.title")}</h2>
          <Link href="/projects" className="text-primaryClr flex items-center">
            <span className="whitespace-nowrap">{t("header.more")}</span>
            <ChevronLeft className={cn(isAr ? "rotate-0" : "rotate-180")} />
          </Link>
        </div>
        <div className="space-y-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};
