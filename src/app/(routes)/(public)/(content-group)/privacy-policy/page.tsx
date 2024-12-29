import { Content } from "../_components/content";
import { getLocale } from "next-intl/server";

import { getData } from "@/lib/request-server";

import { PageHeader } from "./_components/header";
import { PrivacyType } from "@/schemas/content";

export default async function Page() {
  const endpoint = "/content/policy-and-privacy";
  const lang = await getLocale();
  const res = await getData<PrivacyType>({ endpoint, config: { headers: { lang } } });
  if (res.status !== "success") throw new Error("Failed to fetch data");

  const { content } = res.response.content;
  return (
    <>
      <PageHeader />
      <main className="container py-12">
        <Content content={content} />
      </main>
    </>
  );
}
