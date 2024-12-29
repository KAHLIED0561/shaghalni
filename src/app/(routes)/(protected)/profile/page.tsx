import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";

import { createHeaders } from "@/lib/createHeaders";
import { type FetchData } from "@/lib/request";
import { getData } from "@/lib/request-server";
import { decodeSession } from "@/lib/session";

import { AddTransaction } from "./_components/addTransaction";
import { ProfileHeader } from "./_components/header";
import { ProfileProjects } from "./_components/projects";
import { Transactions } from "./_components/transactions";
import { SESSION_NAME } from "@/constant";
import { Role } from "@/schemas/user";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_NAME)?.value;
  if (!session) throw new Error("Session not found");

  const headers = createHeaders(cookieStore);
  const { role } = decodeSession(session);

  const endpointProfile = "/profile";
  const propsProfile: FetchData = { endpoint: endpointProfile, config: { headers } };

  const endpointProjects = "/profile/projects";
  const propsProjects: FetchData = { endpoint: endpointProjects, config: { headers } };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [propsProfile],
    queryFn: () => getData(propsProfile),
  });
  await queryClient.prefetchQuery({
    queryKey: [propsProjects],
    queryFn: () => getData(propsProjects),
  });

  return (
    <main className="mt-20 mb-10">
      <div className="container">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProfileHeader role={role as Role} />
          <AddTransaction />
          <Transactions />
          <ProfileProjects />
        </HydrationBoundary>
      </div>
    </main>
  );
}
