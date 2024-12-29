"use client";

import MoyasarPayment from "../payment/MoyasarPayment";
import { BellIcon, BellOffIcon, XIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createHeaders } from "@/lib/createHeaders";
import { cn, formatDate, shortenString } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useGetData, usePostData } from "@/hooks/useFetch";

type NotificationButtonProps = {};

export const NotificationButton = ({}: NotificationButtonProps) => {
  const headers = createHeaders();
  const locale = useLocale();

  const endpoint = "/notifications";
  const t = useTranslations("notifications");
  const [open, setOpen] = useState(false);

  const isAr = locale === "ar";

  const { isLoading, data } = useGetData({
    endpoint,
    config: {
      headers,
    },
  });

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const response = data?.status === "success" ? data.response : ({} as any);

  return (
    <DropdownMenu modal={false} dir={isAr ? "rtl" : "ltr"} open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button className="relative" disabled={isLoading} aria-label="Open notifications">
          <BellIcon size={24} />

          {(response?.notifications?.length > 0 || response?.financialTransferNotifications?.length > 0) && (
            <div className="size-2 bg-primaryClr-600 rounded-full absolute start-1 top-0" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 mt-2">
        <DropdownMenuLabel>
          <div className="flex items-center justify-between gap-4 my-1">
            <h2 className="font-semibold text-base">{t("title")}</h2>
            <button onClick={() => onOpenChange(false)} aria-label="Close notifications">
              <XIcon size={20} />
            </button>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="space-y-0.5">
          {response?.notifications?.length === 0 && response?.financialTransferNotifications?.length === 0 ? (
            <div className="p-6 flex flex-col items-center gap-2 justify-center text-muted-foreground">
              <BellOffIcon size={30} />
              <p className="text-sm">{t("no_notifications")}</p>
            </div>
          ) : (
            <>
              {response?.financialTransferNotifications?.map((notification: any) => (
                <div className="p-0 !bg-accent" key={notification?.id}>
                  <MoyasarPayment
                    className="w-full !bg-transparent !text-foreground !h-auto !whitespace-normal py-1.5 px-2 flex items-start gap-2"
                    title="Pay now"
                    amount={(notification?.amount || 0) * 100}
                    financialTransferId={notification?.id}
                    content={
                      <>
                        <Avatar className="size-8">
                          <AvatarImage src={notification?.image} alt={"alt"} className="object-contain" />
                          <AvatarFallback className="text-primaryClr border border-primaryClr">
                            {notification?.title?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start w-full text-start">
                          <span className="font-semibold text-sm">{shortenString(notification?.title, 40)}</span>
                          <span className="text-xs text-gray-400">{formatDate(notification?.created_at, locale)}</span>
                        </div>
                      </>
                    }
                  />
                </div>
              ))}

              {response?.notifications?.map((notification: any) => (
                <NotificationItem
                  notification={notification}
                  closeModal={() => onOpenChange(false)}
                  key={notification?.id}
                />
              ))}
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NotificationItem = ({ notification, closeModal }: { notification: any; closeModal: () => void }) => {
  const router = useRouter();
  const locale = useLocale();

  const { mutateAsync } = usePostData({ endpoint: `notifications/${notification?.id}/mark-read` });

  const handleReadMsg = async () => {
    if (!notification?.is_read) {
      try {
        await mutateAsync({});
      } catch (error) {
        console.error("Failed to read message:", error);
      }
    }

    router.push(notification?.link);
    closeModal();
  };

  return (
    <DropdownMenuItem
      className={cn("p-0 hover:bg-accent", {
        "bg-accent": !notification?.is_read,
      })}
      key={notification?.id}
    >
      <button onClick={handleReadMsg} className="w-full py-1.5 px-2 flex items-start gap-2">
        <Avatar className="size-8">
          <AvatarImage src={notification?.image} alt={"alt"} className="object-contain" />
          <AvatarFallback className="text-primaryClr border border-primaryClr">
            {notification?.title?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start w-full text-start">
          <span className="font-semibold text-sm">{shortenString(notification?.title, 40)}</span>
          <span className="text-xs text-gray-400">{formatDate(notification?.created_at, locale)}</span>
        </div>
      </button>
    </DropdownMenuItem>
  );
};
