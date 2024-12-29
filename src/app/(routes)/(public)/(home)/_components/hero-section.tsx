"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { ProjectsForm } from "@/components/home/projects-form";

import { useGetData } from "@/hooks/useFetch";

import heroImg from "@/assets/images/hero.webp";

import { HomeSchema } from "@/schemas/home";

export const HeroSection = () => {
  const locale = useLocale();
  const t = useTranslations("home");
  const HeroSchema = HomeSchema.pick({ location: true });
  const endpoint = "/home";
  const { data } = useGetData<z.infer<typeof HeroSchema>>({ endpoint, config: {} });
  const location = data?.status === "success" ? data.response.location : [];

  const isAr = locale === "ar";

  return (
    <section className="min-h-screen 4xl:min-h-max 4xl:max-h-[1000px] sm:h-screen relative flex flex-col justify-center">
      <div className="w-full h-full overflow-hidden absolute inset-0 -z-10 bg-slate-500">
        <Image
          src={heroImg}
          alt={t("images.hero")}
          className={cn("object-cover object-left-top 2xl:w-full h-full", isAr ? "scale-x-100" : "-scale-x-100")}
          priority
          width={1920}
          height={1080}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 60vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-secondaryClr from-[20%] sm:from-[2%] via-secondaryClr-400/20 sm:via-transparent -z-10"></div>
      <div className="pt-24 container text-white flex flex-col justify-evenly 3xl:justify-center 3xl:gap-24 4xl:justify-center 4xl:gap-[min(10%,10rem)] space-y-8 pb-6">
        <div className="space-y-8">
          <h1 className="font-semibold leading-tight text-4xl xs:text-5xl sm:text-7xl 4xl:text-9xl">
            <span className="block">{t("hero.title")}</span>
            <span className="block">{t("hero.subtitle")}</span>
          </h1>
          <p className="max-w-lg 4xl:max-w-2xl text-lg 4xl:text-2xl">{t("hero.description")}</p>
          <Link
            href="/request-service"
            className="inline-block py-4 px-6 rounded-2.5xl 4xl:text-2xl bg-primaryClr-600 transition-colors hover:bg-primaryClr-500 font-medium"
          >
            {t("hero.request_service")}
          </Link>
        </div>
        <ProjectsForm location={location} />
      </div>
    </section>
  );
};
