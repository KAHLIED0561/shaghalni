import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { z } from "zod";

import { getData } from "@/lib/request-server";

import { ProvidersSearch } from "@/components/providers/search";

import { ProvidersPagination } from "./_components/pagination";
import { ProvidersSection } from "./_components/providers-grid";
import { ProvidersPageHeader } from "./_components/providers-header";
import { mapServiceTypes } from "./_provider-types";
import { CitySchema } from "@/schemas/city";

export default async function ProvidersPage() {
  const endpoint = "/providers/search";
  const config = { queryParams: { page: "1" } };

  const queryClient = new QueryClient();
  const citiesRes = await getData<z.infer<typeof CitySchema>[]>({ endpoint: "/cities" });
  const facilityTypesRes = await getData<{ contractorTypes: z.infer<typeof CitySchema>[] }>({
    endpoint: "/contractors/types",
  });
  const servicesRes = await getData<z.infer<typeof CitySchema>[]>({ endpoint: "/services" });
  await queryClient.prefetchQuery({
    queryKey: [endpoint, config],
    queryFn: () => getData({ endpoint, config }),
  });

  const cities =
    citiesRes.status === "success" ? citiesRes.response.map((city) => ({ id: city.id, option: city.name })) : [];
  const serviceTypes = await mapServiceTypes();
  const facilityTypes =
    facilityTypesRes.status === "success"
      ? facilityTypesRes.response.contractorTypes.map((type) => ({ id: type.id, option: type.name }))
      : [];
  const services =
    servicesRes.status === "success"
      ? servicesRes.response.map((service) => ({ id: service.id, option: service.name }))
      : [];

  return (
    <>
      <ProvidersPageHeader />
      <main className="container">
        <section className="flex justify-center -mt-10  items-center w-full  ">
          <ProvidersSearch
            cities={cities}
            serviceTypes={serviceTypes}
            facilityTypes={facilityTypes}
            services={services}
          />
        </section>
        <section className="pb-10 pt-14">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ProvidersSection />
            <ProvidersPagination />
          </HydrationBoundary>
        </section>
      </main>
    </>
  );
}
