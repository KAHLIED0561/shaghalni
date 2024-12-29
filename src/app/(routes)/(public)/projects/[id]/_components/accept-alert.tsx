"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { type MouseEvent, useState } from "react";
import { toast } from "sonner";

import { createHeaders } from "@/lib/createHeaders";
import type { FetchData } from "@/lib/request";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { usePatchData } from "@/hooks/useFetch";

type AcceptAlertProps = {
  id: string | number;
  label: string;
  projectId: string | number;
};

export const AcceptAlert = ({ id: offerId, label }: AcceptAlertProps) => {
  const lang = useLocale();
  const dir = lang === "ar" ? "rtl" : "ltr";
  const t = useTranslations("projectDetails.offers");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  const headers = createHeaders();
  const endpoint = `/requests/${offerId}/assign-provider`;
  const props: FetchData = { endpoint, config: { headers: { ...headers, lang } } };
  const { mutateAsync } = usePatchData(props);

  const handleAccept = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    let id;
    setInProgress(true);
    toast.dismiss(id);

    const res = await mutateAsync({ applicationId: offerId });
    if (res.status === "fail") {
      const concatenateErrors = Object.values(res.message).join("\n");
      id = toast.error(concatenateErrors, { duration: 5000 });
    }

    if (res.status === "success") {
      toast.success(t("accepted"), {
        duration: 3000,
      });
      router.refresh();
      setOpen(false);
    }

    setInProgress(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="px-6 py-3 w-fit bg-primaryClr text-white hover:bg-primaryClr-400 transition-colors rounded-2.5xl">
        {label}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader dir={dir}>
          <AlertDialogTitle className="text-start">{t("title")}</AlertDialogTitle>
          <AlertDialogDescription className="text-start">{t("alert.description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center gap-2">
          <AlertDialogCancel>{t("alert.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleAccept}>
            {inProgress ? t("alert.inProgress") : t("accept")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
