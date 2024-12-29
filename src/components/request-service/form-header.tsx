"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

type RequestServiceFormHeaderProps = Readonly<{
  step: string | null;
}>;

export const RequestServiceFormHeader = ({ step }: RequestServiceFormHeaderProps) => {
  const t = useTranslations("service_req.steps");
  const isFirst = step === "1";
  const isSecond = step === "2";
  const isLast = step === "3";

  return (
    <div className="flex items-center justify-center mt-4">
      <ol className="grid basis-full max-w-screen-md grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-4">
        <li className="flex sm:flex-col items-center gap-2">
          <div
            className={cn(
              "size-12 flex items-center justify-center border-2 rounded-full text-2xl font-semibold border-primaryClr text-primaryClr",
              isFirst ? "" : "border-primaryClr bg-primaryClr text-white"
            )}
          >
            {isFirst ? 1 : <Check size={24} />}
          </div>
          <span className="text-xl font-semibold">{t("0")}</span>
        </li>
        <li className="flex sm:flex-col items-center gap-2">
          <div
            className={cn(
              "size-12 flex items-center justify-center border-2 rounded-full text-2xl font-semibold border-primaryClr text-primaryClr",
              isFirst || isSecond ? "" : "border-primaryClr bg-primaryClr text-white"
            )}
          >
            {isFirst || isSecond ? 2 : <Check size={24} />}
          </div>
          <span className="text-xl font-semibold">{t("1")}</span>
        </li>
        <li className="flex sm:flex-col items-center gap-2">
          <div
            className={cn(
              "size-12 flex items-center justify-center border-2 rounded-full text-2xl font-semibold border-primaryClr text-primaryClr",
              isFirst || isSecond || isLast ? "" : "border-primaryClr bg-primaryClr text-white"
            )}
          >
            {isFirst || isSecond || isLast ? 3 : <Check size={24} />}
          </div>
          <span className="text-xl font-semibold">{t("2")}</span>
        </li>
      </ol>
    </div>
  );
};
