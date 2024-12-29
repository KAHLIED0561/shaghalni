import { getTranslations } from "next-intl/server";

import { MoneyIcon, WorkerIcon } from "@/components/icons";

export const AboutServicesSection = async () => {
  const t = await getTranslations("home.about_services");
  const servicesList = [
    { title: t("cards.1.title"), description: t("cards.1.description"), icon: WorkerIcon },
    { title: t("cards.2.title"), description: t("cards.2.description"), icon: MoneyIcon },
    { title: t("cards.3.title"), description: t("cards.3.description"), icon: WorkerIcon },
  ];

  return (
    <section className="py-20">
      <div className="container space-y-8">
        <h2 className="w-full text-center font-semibold text-5xl">
          <span>{t("title.1")}</span> <span className="text-primaryClr-600">{t("title.2")}</span>
        </h2>
        <div className="flex justify-center gap-y-6 gap-5 flex-wrap md:flex-nowrap">
          {servicesList.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 md:basis-[calc(100%/3-2.5rem/3)] shadow container py-8 flex flex-col items-center justify-center gap-8 text-center rounded-2.5xl border border-gray-200"
              >
                <div className="bg-white p-6 rounded-full overflow-hidden shadow-md">
                  <Icon className="size-16 text-primaryClr-600" fill={{ className: "fill-primaryClr-600" }} />
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium text-2xl">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
