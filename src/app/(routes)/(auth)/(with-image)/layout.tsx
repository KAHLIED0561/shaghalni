import { getTranslations } from "next-intl/server";
import Image from "next/image";

import authImage from "@/assets/images/auth-bg.webp";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("auth.images");

  return (
    <div>
      <div className="md:p-4 flex gap-4 min-h-screen justify-center overflow-hidden">
        <div className="basis-full md:basis-1/2 lg:basis-[40%] 2xl:basis-[30%] 4xl:basis-auto">{children}</div>
        <div className="hidden md:block md:basis-1/2 lg:basis-[60%] 2xl:basis-[70%] 4xl:hidden">
          <Image
            src={authImage}
            alt={t("auth_layout")}
            className="w-full h-full max-h-[calc(100vh-2rem)] object-cover rounded-[1.25rem] pointer-events-none select-none"
            width={900}
          />
        </div>
      </div>
    </div>
  );
}
