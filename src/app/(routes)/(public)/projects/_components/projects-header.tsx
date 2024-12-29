import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import headerImage from "@/assets/images/projectsPageHeader.webp";

export async function ProjectPageHeader() {
  const t = await getTranslations("projects");

  return (
    <header className="relative mt-20 h-72 ">
      <div className=" absolute inset-0 -z-50 after:absolute after:inset-0 after:bg-gradient-to-b from-[#013237] via-[#013237]/90 to-[#013237]/60">
        <Image fill src={headerImage} alt="" className=" object-cover object-[50%_20%]" />
      </div>
      <div className=" space-y-3 text-center text-white pt-16">
        <h1 className="text-6xl font-semibold  text-center">{t("title")}</h1>
        <p>{t("subtitle")}</p>
        <div className="!mt-8">
          <Link
            href="/request-service"
            className="bg-primaryClr rounded-2.5xl px-6 py-1.5 text-white font-semibold text-lg"
          >
            {t("request_service")}
          </Link>
        </div>
      </div>
    </header>
  );
}
