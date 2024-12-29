"use client";

import { CalendarDays, Clock, FolderOpenDot, HandCoins, MapPin, MapPinned } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

import { ProjectSimple } from "@/schemas/project";

export function ProjectCard({ project }: { project: ProjectSimple }) {
  const t = useTranslations("home.projects");

  return (
    <Link className="block" href={`/projects/${project.id}`}>
      <figure
        key={project.id}
        className="rounded-2.5xl border border-gray-200 bg-gray-50 shadow flex flex-col sm:flex-row gap-2"
      >
        <div className="w-full sm:w-auto h-full p-4">
          <Image
            src={project.imageUrl}
            alt={project.imageAlt}
            width={400}
            height={400}
            title={project.title}
            loading="lazy"
            className="rounded-2xl w-full h-full object-cover sm:size-[200px]"
          />
        </div>
        <figcaption className="px-4 pb-4 sm:py-6 flex-1 flex flex-col md:justify-center">
          <Badge
            className={cn(
              "px-4 py-1 border rounded-2.5xl w-fit font-semibold mb-3",
              project.statusFlag === 1
                ? "bg-primaryClr-500/20 text-primaryClr-500 border-primaryClr-500 hover:bg-primaryClr-500/20"
                : "bg-rose-500/20 text-rose-500 border-rose-500 hover:bg-rose-500/20"
            )}
          >
            {project.status}
          </Badge>
          <h3 className="font-semibold text-2xl w-fit">{project.title}</h3>
          <p className="text-gray-500 mb-4">
            <span>{t("by")}</span> <span>{project.createdByName}</span>
          </p>
          <div className="flex flex-col md:flex-row gap-2 gap-y-1.5 *:text-sm">
            <div className="md:basis-1/2 flex-1 text-sm space-y-3">
              <div className="flex items-center gap-2">
                <HandCoins className="size-4 text-primaryClr inline-block" />
                <span className="text-gray-500">{t("service")}</span>
                <span>{project.serviceType}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-primaryClr inline-block" />
                <span className="text-gray-500">{t("pub_date")}</span>
                {/* Date in the form of 20-11-2024 */}
                <span>{new Date(project.created_at).toLocaleDateString("en-GB")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primaryClr inline-block" />
                <span className="text-gray-500">{t("remaining_time")}</span>
                <span>{project.remainingTime}</span>
              </div>
            </div>
            <div className="md:basis-1/2 text-sm space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primaryClr inline-block" />
                <span className="text-gray-500">{t("location")}</span>
                <span>{project.locationName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinned className="size-4 text-primaryClr inline-block" />
                <span className="text-gray-500">{t("neighborhood")}</span>
                <span>{project.town}</span>
              </div>
              <div className="flex items-center gap-2">
                <FolderOpenDot className="size-4 text-primaryClr inline-block" />
                <span className="text-gray-500">{t("num_offers")}</span>
                <span>{project.numberOfOffers}</span>
              </div>
            </div>
          </div>
        </figcaption>
      </figure>
    </Link>
  );
}
