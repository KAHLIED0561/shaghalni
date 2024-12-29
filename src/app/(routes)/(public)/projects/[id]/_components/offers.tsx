import { getTranslations } from "next-intl/server";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { AcceptAlert } from "./accept-alert";
import type { Project } from "@/schemas/project";

export const ProjectOffers = async ({ project }: { project: Project }) => {
  const t = await getTranslations("projectDetails.offers");
  const { offers, canAccept, id: projectId, winner } = project;
  const isNoOffers = !offers || offers.length === 0;

  if (winner) return null;
  return (
    <section className="bg-gray-100 rounded-2.5xl border border-gray-300 container py-6 space-y-5">
      <h2 className="text-2xl font-semibold">{t("title")}</h2>
      {isNoOffers ? (
        <p className="text-gray-500 text-lg text-center">{t("no_offers")}</p>
      ) : (
        <ul className="space-y-10 sm:space-y-6">
          {offers.map(({ id, imageUrl, imageAlt, title, type, value }) => (
            <li key={id} className="flex sm:items-center justify-between gap-6 flex-col sm:flex-row">
              <div className="flex gap-6 flex-wrap items-center">
                <Avatar className=" size-20 shadow-custom border-2 border-white rounded-xl overflow-clip">
                  <AvatarImage src={imageUrl} alt={imageAlt} className="object-cover object-center" />
                  <AvatarFallback className="rounded-xl">{title.slice(0, 2).toLocaleUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-lg">{title}</h4>
                  <p className="text-gray-600">{type}</p>
                </div>
              </div>
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
                <p className="text-2xl font-semibold">
                  {Number.parseFloat(value.toString()).toFixed(2)} <span className="text-base">{t("SAR")}</span>
                </p>
                {canAccept && (
                  <>
                    <div className="h-10 w-0.5 bg-black/80 rounded-full hidden xs:block" />
                    <AcceptAlert id={id} projectId={projectId} label={t("accept")} />
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
