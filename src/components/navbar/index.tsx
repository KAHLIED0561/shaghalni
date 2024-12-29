import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";

import { createHeaders } from "@/lib/createHeaders";
import { getData } from "@/lib/request-server";
import { verifySession } from "@/lib/session";

import { NavbarContainer } from "./container";
import { SESSION_NAME } from "@/constant";

export const Navbar = async () => {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_NAME)?.value;
  const isLoggedIn = verifySession(session);

  const headers = createHeaders(cookieStore);
  const queryClient = new QueryClient();
  const endpoint = "/auth/current-user";
  await queryClient.prefetchQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [endpoint, {}],
    queryFn: () => getData({ endpoint, config: { headers } }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NavbarContainer isLogged={isLoggedIn} />
    </HydrationBoundary>
  );
};
