"use client";

import { FacebookIcon } from "../icons/facebook";
import InstagramIcon from "../icons/instagram";
import LinkedinIcon from "../icons/linkedin";
import SnapchatIcon from "../icons/snapchat";
import { useTranslations } from "next-intl";
import Image from "next/image";



import { useGetData } from "@/hooks/useFetch";



import appStoreImg from "@/assets/images/app-store.webp";
import googlePlayImg from "@/assets/images/google-play.webp";


const ContactFooter = () => {
  const t = useTranslations("footer");
  const endpoint = "/links";
  const { data } = useGetData<{
    links: {
      id: number;
      en_name: string;
      ar_name: string;
      link: string;
      key: string;
    }[];
  }>({ endpoint });

  const links = data?.status === "success" ? data?.response?.links : null;

  console.log("====================================");
  console.log(data);
  console.log("====================================");

  if (!links) return;

  return (
    <div className="bg-primaryClr-50 py-4">
      <div className="container">
        <div className="flex items-center justify-between gap-x-4 gap-y-6 flex-wrap">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold hidden md:block">{t("follow-us")}</h3>

            <div className="flex items-center gap-2">
              <a
                href={links?.find((link) => link.key === "facebook")?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black [&>svg]:size-8 hover:underline"
              >
                <FacebookIcon />
              </a>

              <a
                href={links?.find((link) => link.key === "instagram")?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black [&>svg]:size-8 hover:underline"
              >
                <InstagramIcon />
              </a>

              <a
                href={links?.find((link) => link.key === "linkedin")?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black [&>svg]:size-8 hover:underline"
              >
                <LinkedinIcon />
              </a>

              <a
                href={links?.find((link) => link.key === "snapchat")?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black [&>svg]:size-8 hover:underline"
              >
                <SnapchatIcon />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold hidden md:block">{t("download-app")}</h3>

            <div className="flex items-center gap-2">
              <a href={links?.find((link) => link.key === "google")?.link} target="_blank" rel="noopener noreferrer">
                <Image
                  src={googlePlayImg}
                  alt="Google Play"
                  width={180}
                  quality={100}
                  className="h-10 w-auto object-contain"
                />
              </a>

              <a href={links?.find((link) => link.key === "apple")?.link} target="_blank" rel="noopener noreferrer">
                <Image
                  src={appStoreImg}
                  alt="App Store"
                  width={180}
                  quality={100}
                  className="h-10 w-auto object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFooter;