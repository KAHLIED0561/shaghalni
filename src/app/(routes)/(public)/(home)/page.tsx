import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

import { createHeaders } from "@/lib/createHeaders";
import { getData } from "@/lib/request-server";

import BannersSection from "@/components/home/banners-section";

import {
  AboutServicesSection,
  HeroSection,
  ProjectsSection,
  ProvidersSection,
  QaSection,
  WhyToChooseSection,
} from "./_components";

export async function generateMetadata() {
  const t = await getTranslations("home");

  const metadata: Metadata = {
    title: t("page_title"),
    description: t("meta_description"),
  };
  return metadata;
}

export default async function Home() {
  const endpoint = "/home";
  const cookieStore = cookies();
  const headers = createHeaders(cookieStore);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [endpoint, {}],
    queryFn: () => getData({ endpoint, config: { headers } }),
  });

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HeroSection />
      </HydrationBoundary>
      <AboutServicesSection />
      <WhyToChooseSection />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProvidersSection />
        <ProjectsSection />
        <BannersSection />
        <QaSection />
      </HydrationBoundary>
    </main>
  );
}
