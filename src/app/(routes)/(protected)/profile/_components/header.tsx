"use client";

import { Link, MapPin, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { createHeaders } from "@/lib/createHeaders";
import { type FetchData } from "@/lib/request";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useGetData } from "@/hooks/useFetch";
import { ModalType, useModalStore } from "@/hooks/useModalStore";

import { ReceivePayment } from "./ReceivePayment";
import { BASE_URL } from "@/constant";
import { CustomerProfile, EngCustomerProfile, FreelancerProfile, Role } from "@/schemas/user";

type ProfileHeaderProps = {
  role: Role;
};

type Profile = CustomerProfile | EngCustomerProfile | FreelancerProfile;

export const ProfileHeader = ({ role }: ProfileHeaderProps) => {
  const t = useTranslations("profile.header");
  const { openModal } = useModalStore();

  const headers = createHeaders();
  const endpoint = "/profile";
  const props: FetchData = { endpoint, config: { headers } };
  const { data, isLoading } = useGetData<Profile>(props);
  const user = data?.status === "success" ? data.response : null;

  const isCustomer = role === "CUSTOMER" || user?.role === "CUSTOMER";
  const isFreelancer = role === "FREELANCER" || user?.role === "FREELANCER";
  const isEngineering = role === "OFFICE" || user?.role === "OFFICE";

  const handleCopy = () => {
    const url = `${process.env.NODE_ENV === "production" ? BASE_URL : "http://localhost:3000"}/share/${isCustomer ? "customer" : "provider"}/${user?.id}`;
    navigator.clipboard.writeText(url);

    toast.success(t("copy_action.title"), {
      description: t("copy_action.description"),
      duration: 3000,
    });
  };

  const handleOpenModal = () => {
    if (!user) return;
    const modalType: ModalType = isCustomer
      ? "editCustomer"
      : isFreelancer
        ? "editFreelancer"
        : isEngineering
          ? "editEngineering"
          : "editContractor";
    openModal(modalType, user);
  };

  if (isLoading || !user) return null;

  return (
    <section className="py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-center gap-y-4 gap-x-8">
        <Avatar
          className={cn(
            "size-40 sm:size-60 shadow-custom border-4 border-white",
            isCustomer ? "rounded-full" : "rounded-2.5xl"
          )}
        >
          <AvatarImage src={user.image as string | undefined} alt={user.name} className=" object-cover object-center" />
          <AvatarFallback
            className={cn(
              "text-4xl sm:text-6xl font-semibold text-primaryClr border-2 border-primaryClr",
              isCustomer ? "rounded-full" : "rounded-2xl"
            )}
          >
            {user.name.toLocaleUpperCase().slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-4xl font-semibold text-center sm:text-start">{user.name}</h2>
          <p className="text-gray-400 text-lg mt-2 text-center sm:text-start">{user.email}</p>
          <div className="flex flex-col xxs:flex-row items-center gap-4 mt-6">
            <Button onClick={handleOpenModal}>{t("editBtn")}</Button>

            {(isFreelancer || isEngineering) && <ReceivePayment defaultValues={{}} />}

            <Button variant="outline" onClick={handleCopy} className="flex items-center gap-2">
              <Link size={24} />
              <span>{t("copyBtn")}</span>
            </Button>
          </div>
        </div>
      </div>
      <div>
        <ul className="bg-gray-100 rounded-2.5xl border border-gray-300 space-y-6 container py-5">
          <li>
            <ul className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              <li className="flex items-center gap-2 flex-wrap">
                <Smartphone className="size-4 text-primaryClr inline-block whitespace-nowrap" />
                <span className="text-gray-500">{t("phone")}</span>
                <span className="text-black" dir="ltr">
                  {user.phone}
                </span>
              </li>
              {user.location && (
                <li className="flex items-center gap-2 flex-wrap">
                  <MapPin className="size-4 text-primaryClr inline-block whitespace-nowrap" />
                  <span className="text-gray-500">{t("address")}</span>
                  <span className="text-black">{user.location}</span>
                </li>
              )}
            </ul>
          </li>
          {!isCustomer && (
            <>
              <li className="space-y-2">
                <h3>{t("activities")}</h3>
                <ul className="flex items-center gap-4 flex-wrap">
                  {user.services.map(({ id, name }) => (
                    <li key={id} className="bg-primaryClr text-white px-4 py-1.5 rounded-2.5xl">
                      {name}
                    </li>
                  ))}
                </ul>
              </li>
              <li className="space-y-2">
                <h3>{t("service")}</h3>
                <p className="bg-white w-full rounded-xl py-2 px-4 border border-gray-300">{user.about}</p>
              </li>
            </>
          )}
        </ul>
      </div>
    </section>
  );
};
