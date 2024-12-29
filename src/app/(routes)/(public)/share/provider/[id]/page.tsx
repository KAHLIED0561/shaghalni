import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";

import { createHeaders } from "@/lib/createHeaders";
import { type FetchData } from "@/lib/request";
import { getData } from "@/lib/request-server";

import { ProfileHeader } from "./_components/header";
import { ProfileProjects } from "./_components/projects";
import { ProfileReviews } from "./_components/reviews";

type ProviderSharedProps = {
  params: { id: string };
};

export default async function ProviderSharedPage({ params }: ProviderSharedProps) {
  const { id } = params;
  const cookieStore = cookies();
  const headers = createHeaders(cookieStore);

  const infoEndpoint = `/profile/share/${id}`;
  const infoProps: FetchData = { endpoint: infoEndpoint, config: { headers } };

  const projectsEndpoint = `/profile/share/${id}/projects`;
  const projectsProps: FetchData = { endpoint: projectsEndpoint, config: { headers } };

  const reviewsEndpoint = `/reviews/${id}`;
  const reviewsProps: FetchData = { endpoint: reviewsEndpoint, config: { headers } };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [infoProps],
    queryFn: () => getData(infoProps),
  });
  await queryClient.prefetchQuery({
    queryKey: [projectsProps],
    queryFn: () => getData(projectsProps),
  });
  await queryClient.prefetchQuery({
    queryKey: [reviewsProps],
    queryFn: () => getData(reviewsProps),
  });
  return (
    <main className="mt-20 mb-10">
      <div className="container">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProfileHeader id={id} />
          <ProfileProjects id={id} />
          <ProfileReviews id={id} />
        </HydrationBoundary>
      </div>
    </main>
  );
}
