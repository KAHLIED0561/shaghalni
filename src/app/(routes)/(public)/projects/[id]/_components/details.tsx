import { Building, CalendarDays, Clock, FolderOpenDot, HandCoins, MapPin, MapPinned, PencilRuler } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

import { AspectRatio } from "@/components/ui/aspect-ratio";

import { AddOffer } from "./add-offer";
import type { Project } from "@/schemas/project";

export const ProjectDetails = async ({ project }: { project: Project }) => {
  const t = await getTranslations("projectDetails.project");

  return (
    <section className="bg-gray-100 rounded-2.5xl border border-gray-300 flex flex-col sm:flex-row">
      <div className="relative aspect-square rounded-xl w-full md:w-[34rem] overflow-clip container py-6">
        <AspectRatio ratio={1 / 1} className="overflow-clip rounded-xl">
          <Image src={project.imageUrl} alt={project.imageAlt} fill className="object-cover" />
        </AspectRatio>
      </div>
      <div className="py-6 container space-y-6">
        <div className="flex justify-between gap-4 xs:gap-6 flex-col xs:flex-row">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">{project.title}</h2>
            <p className="text-gray-500">
              {t("by")}: <Link href={`/share/provider/${project.created_by}`}>{project.createdByName}</Link>
            </p>
          </div>
          {project.canApply && <AddOffer projectId={project.id} />}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <h3 className="font-medium">{t("description")}</h3>
          <p className="bg-white w-full rounded-xl py-2 px-4 border border-gray-300">{project.description}</p>
        </div>

        {/* Data Fields */}
        <div className="flex flex-col md:flex-row gap-2 gap-y-1.5 *:text-sm">
          <div className="md:basis-1/2 flex-1 text-sm space-y-1.5">
            <div className="flex items-center gap-2">
              <HandCoins className="size-4 text-primaryClr inline-block" />
              <span className="text-gray-500">{t("service")}</span>
              <span>{project.serviceType}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primaryClr inline-block" />
              <span className="text-gray-500">{t("publish_date")}</span>
              {/* Date in the form of 20-11-2024 */}
              <span>{new Date(project.created_at).toLocaleDateString("en-GB")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primaryClr inline-block" />
              <span className="text-gray-500">{t("remaining_time")}</span>
              <span>{project.remainingTime}</span>
            </div>
            {project.landArea && (
              <div className="flex items-center gap-2">
                <PencilRuler className="size-4 text-primaryClr inline-block" />
                <span className="text-gray-500">{t("area")}</span>
                <span>{project.landArea}</span>
              </div>
            )}
          </div>
          <div className="md:basis-1/2 text-sm space-y-1.5">
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
              <span className="text-gray-500">{t("offers")}</span>
              <span>{project.numberOfOffers}</span>
            </div>
            {project.numOfFloors && (
              <div className="flex items-center gap-2">
                <Building className="size-4 text-primaryClr inline-block" />
                <span className="text-gray-500">{t("floors")}</span>
                <span>{project.numOfFloors}</span>
              </div>
            )}
          </div>
        </div>

        {/* Services */}
        <div className="space-y-1.5">
          <h3 className="font-medium mt-5">{t("activities")}</h3>
          <ul className="flex items-center gap-2 flex-wrap">
            {project.serviceNames.map((service, idx) => {
              return (
                <p key={idx} className="text-white bg-primaryClr-600 rounded-2xl px-4 py-1.5 w-fit">
                  {service}
                </p>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
