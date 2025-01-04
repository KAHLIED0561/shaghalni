import { MoveLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MoyasarPayment from "../payment/MoyasarPayment";

type TransactionItemProps = {
  type: "CASH" | "CARD";
  image: string | null;
  date: string;
  id: string | number;
  value: number;
  fromName: string;
  toName: string;
};

export const TransactionItem = ({ image, fromName, toName, value, type, date, id }: TransactionItemProps) => {
  const t = useTranslations("profile.latestTransfers");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-2">
      <div className="flex flex-col xxs:flex-row xxs:items-center gap-4">
        <Avatar className="size-16 sm:size-12 rounded-xl xs:rounded-full shadow-custom bg-white">
          <AvatarImage src={image as string} alt={fromName} className="rounded-xl xs:rounded-full" />
          <AvatarFallback className="text-primaryClr rounded-xl xs:rounded-full">{fromName.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-4 font-semibold">
          <p>{fromName}</p>
          <MoveLeft className={cn("size-5", isAr ? "rotate-0" : "rotate-180")} />
          <p className="text-primaryClr">{toName}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className="font-medium text-xl">
          {value.toFixed(2)} {t("SAR")}
        </p>
        <span className="text-gray-500">{type === "CASH" ? t("cash") : t("card")}</span>
      </div>
      <div className="flex items-center md:justify-end">
        <p className="text-gray-500">{date}</p>
      </div>

      <div className="flex items-center md:justify-end">
        <MoyasarPayment amount={value * 100} financialTransferId={id} className="px-8 py-1.5" title={t("btn")} />
      </div>
    </div>
  );
};
