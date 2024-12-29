import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

import logoEn from "@/assets/images/logo-dark-en.svg";
import logoAr from "@/assets/images/logo-dark.svg";

export default async function SignUpLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("main");
  const isAr = (await getLocale()) === "ar";

  return (
    <div className="container py-10 space-y-10">
      <header>
        <Link href="/">
          <Image src={isAr ? logoAr : logoEn} alt={t("title")} width={180} />
        </Link>
      </header>
      <main className="container bg-[#FDFEFE] border border-[#E5E5E5] rounded-2.5xl py-8">{children}</main>
    </div>
  );
}
