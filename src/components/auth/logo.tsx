import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import logoDarkEn from "@/assets/images/logo-dark-en.svg";
import logoDarkAr from "@/assets/images/logo-dark.svg";

export const Logo = () => {
  const locale = useLocale();
  const t = useTranslations("main");

  const isAr = locale === "ar";

  return (
    <Link href="/">
      <Image src={isAr ? logoDarkAr : logoDarkEn} alt={t("title")} width={140} />
    </Link>
  );
};
