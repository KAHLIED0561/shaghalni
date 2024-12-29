import { format } from "date-fns";
import { CalendarDaysIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { shortenString } from "@/lib/utils";

import { BlogType } from "@/schemas/blog";

export const BlogCard = ({ id, title, description, image, created_at, timeToRead }: BlogType) => {
  return (
    <Link href={`/blogs/${id}`}>
      <figure className="space-y-6 rounded-2.5xl border border-gray-200 bg-gray-50 shadow p-5 flex flex-col items-center">
        <Image
          src={image}
          alt={title}
          width={400}
          height={400}
          title={title}
          loading="lazy"
          className="w-full aspect-square rounded-lg"
        />
        <figcaption className="w-full space-y-3">
          <h3 className="font-semibold text-2xl">{shortenString(title, 30)}</h3>
          <p>{shortenString(description, 70)}</p>
          <div className="flex flex-col xs:flex-row xs:items-center xs:gap-2 text-gray-500">
            <CalendarDaysIcon className="size-4 hidden xs:inline-block" />
            <span>{format(new Date(created_at), "dd MMM yyyy")}</span>
            <span className="hidden xs:block">•</span>
            <span>{timeToRead}</span>
          </div>
        </figcaption>
      </figure>
    </Link>
  );
};
