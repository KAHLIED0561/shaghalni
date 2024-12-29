import { getLocale } from "next-intl/server";

import { getData } from "@/lib/request-server";

import { BlogCard } from "./_components/card";
import { PageHeader } from "./_components/header";
import { BlogsResType } from "@/schemas/blog";

export default async function Page() {
  const lang = await getLocale();
  const res = await getData<BlogsResType>({ endpoint: "/blogs", config: { headers: { lang } } });
  if (!res || res.status === "fail") {
    throw new Error("Failed to fetch data");
  }

  const { blogs } = res.response;
  return (
    <>
      <PageHeader />
      <main className="container py-12">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <li key={blog.id}>
              <BlogCard {...blog} />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
