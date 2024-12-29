import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

import { createHeaders } from "@/lib/createHeaders";
import { getData } from "@/lib/request-server";

import { HeaderBreadcrumb } from "@/components/header-breadcrumb";

import { ProjectAttachments } from "./_components/attachments";
import { ProjectDetails } from "./_components/details";
import { ProjectOffers } from "./_components/offers";
import { ProjectWinner } from "./_components/winner";
import type { Project } from "@/schemas/project";

type ProjectPageProps = {
  params: { id: string };
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = params;
  const cookieStore = cookies();
  const headers = createHeaders(cookieStore);
  const t = await getTranslations("projectDetails");

  const res = await getData<Project>({ endpoint: `/projects/${id}`, config: { headers } });
  const project = res.status === "success" ? res.response : null;
  if (!project) throw new Error(t("noProjectFound"));

  return (
    <div className="mt-20">
      <HeaderBreadcrumb
        itemsList={[
          { link: "/", value: t("path.home") },
          { link: "/projects", value: t("path.projects") },
          { link: `/projects/${id}`, value: project?.title || "Project" },
        ]}
      />
      <main className="container my-12 space-y-10">
        <ProjectDetails project={{ ...project }} />
        <ProjectAttachments project={project} />
        <ProjectWinner project={project} />
        <ProjectOffers project={project} />
      </main>
    </div>
  );
}
