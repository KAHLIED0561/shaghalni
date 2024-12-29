"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations("error");

  return (
    <main className="bg-secondaryClr text-white h-screen w-full">
      <div className="container w-full h-full flex items-center justify-center flex-col text-center">
        <h1 className="text-2xl bg-primaryClr px-4 py-2 rounded-lg">{t("header")}</h1>
        <p className="text-5xl font-semibold mt-4">{t("default_message")}</p>
        <p className="text-xl mt-4">{t("message")}</p>
        <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => reset()}
            className="w-fit rounded-xl border-2 border-primaryClr px-6 py-2 transition-colors hover:bg-primaryClr/50"
          >
            {t("try")}
          </button>
          <Link href="/">{t("home")}</Link>
        </div>
      </div>
    </main>
  );
}
