"use client";

import { CloudUpload } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

import { createHeaders } from "@/lib/createHeaders";
import type { FetchData } from "@/lib/request";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import { useGetData } from "@/hooks/useFetch";
import type { ModalType } from "@/hooks/useModalStore";

import { API_URL } from "@/constant";

type ImageType = {
  src: string | undefined;
  file: File | undefined;
};

type ImageHeaderProps = {
  type: ModalType;
  name: string;
  email: string;
  src: string | undefined;
};

const mapEndpoint = (type: ModalType) => {
  switch (type) {
    case "editCustomer":
      return "/customer/update-image";
    case "editFreelancer":
      return "/freelancers/image";
    case "editEngineering":
      return "/offices/logo";
    case "editContractor":
      return "/contractors/logo";
    default:
      return "/customer/update-image";
  }
};

export const ImageHeader = ({ type, name, email, src }: ImageHeaderProps) => {
  const t = useTranslations("profile.updateProfile");
  const lang = useLocale();
  const [image, setImage] = useState<ImageType | undefined>(src ? { src, file: undefined } : undefined);
  const isImage = type === "editCustomer" || type === "editFreelancer" ? "image" : "logo";

  const headers = createHeaders();
  const endpoint = API_URL + mapEndpoint(type);

  const profileEndpoint = "/profile";
  const profileProps: FetchData = { endpoint: profileEndpoint, config: { headers } };
  const { refetch: refetchProfile } = useGetData(profileProps);

  const currentUserEndpoint = "/auth/current-user";
  const currentUserProps: FetchData = { endpoint: currentUserEndpoint, config: { headers } };
  const { refetch: refetchCurrentUser } = useGetData(currentUserProps);

  const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let id;
    toast.dismiss(id);

    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(isImage, file);

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { ...headers, lang },
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        if (typeof result.message === "string") toast.error(result.message, { duration: 5000 });
        const concatenateErrors = Object.values(result.message).join("\n");
        toast.error(concatenateErrors, { duration: 5000 });
        return;
      }
      setImage({ src: URL.createObjectURL(file), file });
      refetchProfile();
      refetchCurrentUser();
      id = toast.success("تم تحديث الصورة بنجاح", { duration: 5000 });
    } catch (error) {
      id = toast.error("حدث خطأ ما، يرجى المحاولة مرة أخرى", { duration: 5000 });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex flex-col xxs:flex-row items-center gap-4 flex-1">
        <Avatar className="size-32 xxs:size-24 shadow-custom border-4 border-white">
          <AvatarImage src={image?.src} alt={name} />
          <AvatarFallback>{name.slice(0, 2).toLocaleUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="font-semibold text-2xl">{name}</h2>
          <p className="text-gray-400">{email}</p>
        </div>
      </div>
      <form>
        <div className="flex items-center gap-4">
          <label htmlFor="image">
            <Input
              type="file"
              id="image"
              multiple={false}
              accept="image/*"
              placeholder={t("personal_image.placeholder")}
              className="hidden"
              onChange={onImageChange}
            />
            <span className="flex items-center gap-2 text-primaryClr rounded-2.5xl border-2 border-primaryClr px-4 py-1.5 cursor-pointer">
              <CloudUpload className="size-4" />
              <span className="whitespace-nowrap">{t("change_photo")}</span>
            </span>
          </label>
        </div>
      </form>
    </div>
  );
};
