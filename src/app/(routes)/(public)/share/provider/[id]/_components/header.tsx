"use client";

import { MapPin, MessageSquareText, Target } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { createHeaders } from "@/lib/createHeaders";
import { type FetchData } from "@/lib/request";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useGetData } from "@/hooks/useFetch";

import { mapRole } from "./_map-role";
import { ProviderProfileType } from "@/schemas/share";

type ProfileHeaderProps = {
  id: string;
};

export const ProfileHeader = ({ id }: ProfileHeaderProps) => {
  const lang = useLocale();
  const t = useTranslations("share.customer");
  const headers = createHeaders();

  const infoEndpoint = `/profile/share/${id}`;
  const infoProps: FetchData = { endpoint: infoEndpoint, config: { headers } };
  const { data, isLoading } = useGetData<ProviderProfileType>(infoProps);
  const info = data?.status === "success" ? data.response : null;

  if (isLoading) return null;
  return (
    <section className="py-8 space-y-8">
      <div className="container py-8 flex flex-col sm:flex-row items-center gap-y-4 gap-x-8 bg-gray-100 rounded-2.5xl border border-gray-300">
        <Avatar className={cn("size-32 sm:size-44 shadow-custom border-4 border-white rounded-2.5xl")}>
          <AvatarImage src={info?.image} alt={info?.name} className=" object-cover object-center" />
          <AvatarFallback
            className={cn(
              "text-4xl sm:text-6xl font-semibold text-primaryClr border-2 border-primaryClr rounded-2.5xl"
            )}
          >
            {info?.name.toLocaleUpperCase().slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex flex-col sm:flex-row justify-between gap-x-8 gap-4">
          <div>
            <h2 className="text-4xl font-semibold text-center sm:text-start">{info?.name}</h2>
            {info?.role && (
              <p className="text-gray-400 text-lg mt-2 text-center sm:text-start">{mapRole(info.role, lang)}</p>
            )}
            <ul className="flex justify-center sm:justify-start items-center gap-3 mt-4 flex-wrap">
              {info?.services.map(({ id, name }) => (
                <li key={id} className="px-4 py-1.5 bg-primaryClr text-white rounded-2.5xl text-center">
                  {name}
                </li>
              ))}
            </ul>
          </div>
          <Button className="flex items-center gap-2 px-6 py-2">
            <MessageSquareText />
            <span className="text-lg font-medium">{t("message")}</span>
          </Button>
        </div>
      </div>
      <div>
        <ul className="bg-gray-100 rounded-2.5xl border border-gray-300 space-y-6 container py-5">
          <li>
            <ul className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              {info?.location && (
                <li className="flex items-center gap-2 flex-wrap">
                  <MapPin className="size-4 text-primaryClr inline-block whitespace-nowrap" />
                  <span className="text-gray-500">{t("city")}</span>
                  <span className="text-black">{info.location}</span>
                </li>
              )}
              <li className="flex items-center gap-2 flex-wrap">
                <Target className="size-4 text-primaryClr inline-block whitespace-nowrap" />
                <span className="text-gray-500">{t("no_projects")}</span>
                <span className="text-black" dir="ltr">
                  {info?.numOfProjects}
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </section>
  );
};
