import { getTranslations } from "next-intl/server";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { Project } from "@/schemas/project";

export const ProjectWinner = async ({ project }: { project: Project }) => {
  const t = await getTranslations("projectDetails.win_offers");
  const { winner } = project;

  if (!winner) return null;
  return (
    <section className="bg-gray-100 rounded-2.5xl border border-gray-300 container py-6 space-y-5">
      <h2 className="text-2xl font-semibold">{t("title")}</h2>
      <div className="flex gap-6 flex-wrap items-center">
        <Avatar className=" size-20 shadow-custom border-2 border-white rounded-xl overflow-clip">
          <AvatarImage src={winner.imageUrl} alt={winner.imageAlt} className="object-cover object-center" />
          <AvatarFallback className="rounded-xl">{winner.title}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-lg">{winner.title}</h4>
          <p className="text-gray-600">{winner.type}</p>
        </div>
      </div>
    </section>
  );
};
