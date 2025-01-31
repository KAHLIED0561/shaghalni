import { formatDate } from "date-fns";
import { CalendarDaysIcon } from "lucide-react";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

import { getData } from "@/lib/request-server";

import { BlogType } from "@/schemas/blog";

type BlogPageProps = {
  params: { id: string };
};

export default async function Page({ params: { id } }: BlogPageProps) {
  if (!id) throw new Error("No blog ID provided");

  const lang = await getLocale();
  const res = await getData<BlogType>({ endpoint: `/blogs/${id}`, config: { headers: { lang } } });
  if (!res || res.status === "fail") {
    throw new Error("Failed to fetch data");
  }

  const { title, image, description, created_at, timeToRead } = res.response;
  const imageWidth = 1024;
  const imageHeight = imageWidth * (2 / 3);
  return (
    <main className="container pt-28 pb-12">
      <article className="w-full py-6 container rounded-2.5xl border border-gray-200 bg-gray-50 shadow space-y-6">
        <h2 className="font-semibold text-4xl">{title}</h2>
        <div className="flex flex-col xs:flex-row xs:items-center xs:gap-2 text-gray-500">
          <CalendarDaysIcon className="size-4 hidden xs:inline-block" />
          <span>{formatDate(new Date(created_at), "dd MMM yyyy")}</span>
          <span className="hidden xs:block">•</span>
          <span>{timeToRead}</span>
        </div>

        <Image
          src={image || "https://placehold.co/600x400.png"}
          alt={title}
          width={imageWidth}
          height={imageHeight}
          title={title}
          loading="lazy"
          className="w-full aspect-[5/3] object-cover rounded-lg"
          quality={80}
        />

        <ReactMarkdown>{description}</ReactMarkdown>
      </article>
    </main>
  );
}
