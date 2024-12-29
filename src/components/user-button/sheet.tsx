"use client";

import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useGetData } from "@/hooks/useFetch";

import { CurrentUserSchema } from "@/schemas/user";

export const UserButtonSheet = () => {
  const endpoint = "/auth/current-user";
  const { data, isLoading } = useGetData<z.infer<typeof CurrentUserSchema>>({ endpoint, config: {} });
  const currentUserData = data?.status === "success" ? data.response : null;

  if (isLoading) return null;
  return (
    <div className="px-4 flex items-center gap-4">
      <div>
        <Avatar className="size-16 border border-primaryClr">
          <AvatarImage src={currentUserData?.image as string | undefined} alt={currentUserData?.name} />
          <AvatarFallback className="text-primaryClr">{currentUserData?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <div className="space-y-1">
        <h2 className="font-bold text-primaryClr text-base">{currentUserData?.name}</h2>
      </div>
    </div>
  );
};
