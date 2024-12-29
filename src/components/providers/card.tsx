import { FolderOpenDot, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import { cn, shortenString } from "@/lib/utils";

type provider = {
  title: string;
  description: string;
  location: string;
  id: string | number;
  imageUrl: string;
  imageAlt: string;
  numOfProjects: number;
};

export const ProvidersCard = ({ provider }: { provider: provider }) => {
  const t = useTranslations("home.providers");

  return (
    <figure
      key={provider.id}
      className="space-y-6 rounded-2.5xl border border-gray-200 bg-gray-50 shadow p-5 flex flex-col items-center"
    >
      <Image
        src={provider.imageUrl || "/icon-192.png"}
        alt={provider.imageAlt || ""}
        width={400}
        height={400}
        title={provider.title}
        loading="lazy"
        className={cn("w-full aspect-square rounded-lg",
          !provider.imageUrl && "opacity-50 grayscale"
        )}
      />
      <figcaption className="w-full">
        <Link href={`/share/provider/${provider.id}`}>
          <h3 className="text-primaryClr font-semibold text-xl mb-2">{shortenString(provider.title, 30)}</h3>
        </Link>
        <p className="text-gray-500 mb-4" title={provider.description}>
          {shortenString(provider.description, 30)}
        </p>
        <div className="text-sm space-y-1.5">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primaryClr inline-block" />
            <span className="text-gray-500">{t("location")}</span>
            <span>{provider.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <FolderOpenDot className="size-4 text-primaryClr inline-block" />
            <span className="text-gray-500">{t("projects")}</span>
            <span>{provider.numOfProjects}</span>
          </div>
        </div>
      </figcaption>
    </figure>
  );
};
