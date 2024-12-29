import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { v4 as uuidV4 } from "uuid";
import { z } from "zod";

import { createHeaders } from "@/lib/createHeaders";
import { getData } from "@/lib/request-server";

import { ProjectsSearch } from "@/components/projects/search";

import { ProjectsPagination } from "./_components/pagination";
import { ProjectsSection } from "./_components/projects-grid";
import { ProjectPageHeader } from "./_components/projects-header";
import { CitySchema } from "@/schemas/city";
import { ProjectStatus } from "@/schemas/project";
import BannersSection from "@/components/home/banners-section";

export default async function ProjectsPage() {
  const cookieStore = cookies();
  const headers = createHeaders(cookieStore);
  const endpoint = "/projects";
  const config = { queryParams: { page: "1" } };

  const queryClient = new QueryClient();
  const citiesRes = await getData<z.infer<typeof CitySchema>[]>({ endpoint: "/cities", config: { headers } });
  const statusRes = await getData<ProjectStatus[]>({ endpoint: "/statuses/project", config: { headers } });
  await queryClient.prefetchQuery({
    queryKey: [endpoint, config],
    queryFn: () => getData({ endpoint, config }),
  });

  const locations =
    citiesRes.status === "success" ? citiesRes.response.map((city) => ({ id: city.id, option: city.name })) : [];
  const status =
    statusRes.status === "success"
      ? statusRes.response.map((state) => ({ id: uuidV4(), key: state.key, value: state.value }))
      : [];

  return (
    <>
      <ProjectPageHeader />
      <main className="container">
        <section className="flex justify-center -mt-10  items-center w-full  ">
          <ProjectsSearch location={locations} status={status} />
        </section>

        <BannersSection />
        
        <section className="pb-10 pt-14">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ProjectsSection />
            <ProjectsPagination />
          </HydrationBoundary>
        </section>
      </main>
    </>
  );
}
