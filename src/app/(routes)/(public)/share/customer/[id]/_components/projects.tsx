"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { createHeaders } from "@/lib/createHeaders";
import type { FetchData } from "@/lib/request";

import { ProjectCard } from "@/components/projects";
import { Button } from "@/components/ui/button";

import { useGetData } from "@/hooks/useFetch";

import { ProjectRes } from "@/schemas/share";

type ProfileProjectsProps = {
  id: string;
};

export const ProfileProjects = ({ id }: ProfileProjectsProps) => {
  const t = useTranslations("projects");
  const profileT = useTranslations("profile.projects.projectStatus");

  const headers = createHeaders();
  const endpoint = `/profile/share/${id}/projects`;
  const propsProjects: FetchData = { endpoint, config: { headers } };
  const { data, status } = useGetData<ProjectRes>(propsProjects);
  const projects = data?.status === "success" ? data.response.formattedRequests : null;
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [filter, setFilter] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (!projects) {
      setFilteredProjects(null);
      return;
    }

    switch (filter) {
      case 1:
        setFilteredProjects(projects);
        break;
      case 2:
        setFilteredProjects(projects.filter((project) => project.statusFlag === 1));
        break;
      case 3:
        setFilteredProjects(projects.filter((project) => project.statusFlag === 0));
        break;
    }
  }, [projects, filter]);

  const handleFilter = (newFilter: 1 | 2 | 3) => {
    setFilter(newFilter);
  };

  if (status === "pending" || status === "error" || data?.status === "fail") return null;
  return (
    <section className="pt-8 space-y-6">
      <h2 className="text-4xl font-semibold">{t("title")}</h2>
      <div>
        <ul className="flex flex-col sm:flex-row sm:items-center gap-4">
          <li>
            <Button variant={filter === 1 ? "default" : "outline"} onClick={() => handleFilter(1)}>
              {profileT("all")}
            </Button>
          </li>
          <li>
            <Button variant={filter === 2 ? "default" : "outline"} onClick={() => handleFilter(2)}>
              {profileT("inProgress")}
            </Button>
          </li>
          <li>
            <Button variant={filter === 3 ? "default" : "outline"} onClick={() => handleFilter(3)}>
              {profileT("completed")}
            </Button>
          </li>
        </ul>
      </div>
      <div className="grid gap-4 mb-10">
        {filteredProjects?.length === 0 && (
          <div className="text-center flex items-center justify-center py-5">
            <p>{t("no_projects")}</p>
          </div>
        )}
        {filteredProjects &&
          filteredProjects.map((project) => <ProjectCard key={project.id} project={{ ...project }} />)}
      </div>
    </section>
  );
};
