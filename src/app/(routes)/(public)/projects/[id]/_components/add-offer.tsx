"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { useModalStore } from "@/hooks/useModalStore";

type AddOfferProps = {
  projectId: number | string;
};

export const AddOffer = ({ projectId }: AddOfferProps) => {
  const t = useTranslations("projectDetails.project");
  const { openModal } = useModalStore();

  const handleClick = () => {
    openModal("addOffer", { projectId });
  };

  return (
    <Button onClick={handleClick} className="py-4 px-6 w-fit">
      {t("btn")}
    </Button>
  );
};
