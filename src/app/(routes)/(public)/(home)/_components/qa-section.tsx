"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { useGetData } from "@/hooks/useFetch";

import bgImage from "@/assets/images/qa.webp";

import { QaSectionSkeleton } from "./qa-section-skeleton";
import { HomeSchema } from "@/schemas/home";

export const QaSection = () => {
  const t = useTranslations("home.qa");
  const QaSchema = HomeSchema.pick({ qa: true });
  const endpoint = "/home";
  const { data, isLoading } = useGetData<z.infer<typeof QaSchema>>({ endpoint, config: {} });
  const qaList = data?.status === "success" ? data.response.qa : [];

  if (isLoading) return <QaSectionSkeleton />;
  return (
    <section className="py-20 container space-y-6">
      <h2 className="font-semibold text-4xl text-pretty">{t("title")}</h2>
      <div className="flex justify-between gap-8">
        <div className="rounded-2.5xl border border-gray-200 bg-gray-50 shadow flex-1 h-fit container py-4">
          <Accordion type="single" collapsible defaultValue={qaList[0].id.toString()}>
            {qaList.map(({ id, qTitle, qAnswer }, idx) => (
              <AccordionItem
                key={id}
                value={`${id}`}
                className={cn("text-start", idx === qaList.length - 1 ? "border-b-0" : "")}
              >
                <AccordionTrigger className="font-medium text-lg xs:text-xl hover:no-underline text-start">
                  {qTitle}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 text-base">{qAnswer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="hidden lg:block">
          <Image
            src={bgImage}
            alt={t("image")}
            width={400}
            loading="lazy"
            className="rounded-2.5xl h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};
