import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { HouseIcon, MoneyIcon, WorkerIcon } from "@/components/icons";

import whyToChooseUsImg2 from "@/assets/images/why-to-choose-2.webp";
import whyToChooseUsImg from "@/assets/images/why-to-choose.webp";

export const WhyToChooseSection = async () => {
  const locale = await getLocale();
  const t = await getTranslations("home");

  const isAr = locale === "ar";

  return (
    <section className="w-full relative">
      <div
        className={cn(
          "absolute inset-0 from-secondaryClr from-[50%] lg:from-[60%] xl:bg-secondaryClr-600 -z-10 xl:-z-20",
          isAr ? "bg-gradient-to-l" : "bg-gradient-to-r"
        )}
      ></div>
      <div className="absolute end-0 top-0 overflow-hidden h-full -z-20 4xl:hidden">
        <Image
          src={whyToChooseUsImg}
          alt={t("images.whyToChoose")}
          className={cn("object-cover h-full w-full", isAr ? "scale-x-100" : "-scale-x-100")}
          width={600}
          loading="lazy"
        />
      </div>
      <div className="container text-white py-20 flex items-center justify-between gap-8">
        <div className="space-y-6">
          <h2 className="text-primaryClr font-semibold text-2xl">{t("whyToChooseUs.q")}</h2>
          <h3 className="font-semibold text-4xl max-w-md text-pretty">{t("whyToChooseUs.title")}</h3>
          <p className="max-w-xl text-gray-300">{t("whyToChooseUs.description")}</p>
          <div className="flex flex-wrap 4xl:flex-nowrap gap-4 !mt-10">
            <div className="max-w-xs">
              <div className="mb-2">
                <WorkerIcon className="size-24 text-primaryClr" fill={{ className: "fill-primaryClr" }} />
              </div>
              <h4 className="font-medium text-xl mb-2">{t("whyToChooseUs.reasons.1.title")}</h4>
              <p className="text-balance text-gray-300">{t("whyToChooseUs.reasons.1.description")}</p>
            </div>
            <div className="max-w-xs">
              <div className="mb-2">
                <MoneyIcon className="size-24 text-primaryClr" fill={{ className: "fill-primaryClr" }} />
              </div>
              <h4 className="font-medium text-xl mb-2">{t("whyToChooseUs.reasons.2.title")}</h4>
              <p className="text-balance text-gray-300">{t("whyToChooseUs.reasons.2.description")}</p>
            </div>
            <div className="max-w-xs">
              <div className="mb-2">
                <HouseIcon className="size-24 text-primaryClr" fill={{ className: "fill-primaryClr" }} />
              </div>
              <h4 className="font-medium text-xl mb-2">{t("whyToChooseUs.reasons.3.title")}</h4>
              <p className="text-balance text-gray-300">{t("whyToChooseUs.reasons.3.description")}</p>
            </div>
          </div>
        </div>
        <div className="hidden 4xl:block w-1/2 border-4 border-white rounded-2.5xl overflow-hidden">
          <Image
            src={whyToChooseUsImg2}
            alt={t("images.whyToChoose")}
            className={cn("object-cover h-full pointer-events-none", isAr ? "scale-x-100" : "-scale-x-100")}
            width={600}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};
