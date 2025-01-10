"use client";

import { Trash2Icon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";
import { toast } from "sonner";



import { createHeaders } from "@/lib/createHeaders";
import { FetchData } from "@/lib/request";



import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";



import { useDeleteData } from "@/hooks/useFetch";


const DeleteProject = ({ projectId }: { projectId: string | number }) => {
  const t = useTranslations("projectDetails.project.alert");
  const [open, setOpen] = useState(false);
  const lang = useLocale();
  const dir = lang === "ar" ? "rtl" : "ltr";

  const router = useRouter();
  const [inProgress, setInProgress] = useState(false);

  const headers = createHeaders();
  const endpoint = `/requests/${projectId}`;
  const props: FetchData = { endpoint, config: { headers: { ...headers, lang } } };
  const { mutateAsync } = useDeleteData(props);

  const handleDelete = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    let id;
    setInProgress(true);
    toast.dismiss(id);

    const res = await mutateAsync({ applicationId: projectId });
    if (res.status === "fail") {
      const concatenateErrors = Object.values(res.message).join("\n");
      id = toast.error(concatenateErrors, { duration: 5000 });
    }

    if (res.status === "success") {
      toast.success(t("deleted"), {
        duration: 3000,
      });
      router.push("/projects");
      setOpen(false);
    }

    setInProgress(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="flex gap-1.5 items-center px-4 py-2 w-fit h-11 bg-primaryClr text-white hover:bg-primaryClr-400 transition-colors rounded-2.5xl">
        <Trash2Icon className="size-5" />
        {t("delete")}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader dir={dir}>
          <AlertDialogTitle className="text-center text-2xl">{t("title")}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex items-center gap-2">
          <AlertDialogAction
            disabled={inProgress}
            className="flex-1 bg-red-600 hover:bg-red-500"
            onClick={handleDelete}
          >
            {inProgress ? t("inProgress") : t("delete")}
          </AlertDialogAction>

          <AlertDialogCancel className="flex-1 !text-gray-500 border-gray-300 hover:bg-gray-100">
            {t("cancel")}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProject;