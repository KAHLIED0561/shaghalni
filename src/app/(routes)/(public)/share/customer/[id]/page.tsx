import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";

import { createHeaders } from "@/lib/createHeaders";
import { type FetchData } from "@/lib/request";
import { getData } from "@/lib/request-server";

import { ProfileHeader } from "./_components/header";
import { ProfileProjects } from "./_components/projects";

type CustomerSharedProps = {
  params: { id: string };
};

export default async function CustomerSharedPage({ params }: CustomerSharedProps) {
  const { id } = params;
  const cookieStore = cookies();
  const headers = createHeaders(cookieStore);

  const infoEndpoint = `/profile/share/${id}`;
  const infoProps: FetchData = { endpoint: infoEndpoint, config: { headers } };

  const projectsEndpoint = `/profile/share/${id}/projects`;
  const projectsProps: FetchData = { endpoint: projectsEndpoint, config: { headers } };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [infoProps],
    queryFn: () => getData(infoProps),
  });
  await queryClient.prefetchQuery({
    queryKey: [projectsProps],
    queryFn: () => getData(projectsProps),
  });
  return (
    <main className="mt-20 mb-10">
      <div className="container">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProfileHeader id={id} />
          <ProfileProjects id={id} />
        </HydrationBoundary>
      </div>
    </main>
  );
}
