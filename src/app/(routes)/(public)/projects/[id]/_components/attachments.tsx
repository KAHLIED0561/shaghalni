import { getTranslations } from "next-intl/server";

import { shortenString } from "@/lib/utils";

import { ImageIcon, PdfIcon } from "@/components/icons";

import type { Project } from "@/schemas/project";

export const ProjectAttachments = async ({ project }: { project: Project }) => {
  const t = await getTranslations("projectDetails.attachments");
  const isAttachmentsEmpty = !project.attachments || project.attachments.length < 1;

  return (
    <section className="bg-gray-100 rounded-2.5xl border border-gray-300 container py-6 space-y-1.5">
      <h2 className="text-2xl font-semibold">{t("title")}</h2>
      {isAttachmentsEmpty && <p className="text-gray-500">{t("no_attachments")}</p>}
      {!isAttachmentsEmpty && (
        <ul className="flex gap-8 flex-wrap !mt-4">
          {project.attachments.map((attachment) => {
            const { id, size, title, url, type } = attachment;
            return (
              <li key={id}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="flex gap-3" download>
                  {type === "IMAGE" ? <ImageIcon className="size-11" /> : <PdfIcon className="size-11" />}
                  <div className="flex flex-col justify-between">
                    <span>{shortenString(title, 20)}</span>
                    <span className="text-gray-500 font-[500]">{size}</span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
