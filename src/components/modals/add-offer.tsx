"use client";

import { Banknote } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { isEmpty, isInt } from "validator";

import { createHeaders } from "@/lib/createHeaders";
import type { FetchData } from "@/lib/request";

import { FormErrors } from "@/components/auth/form-errors";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { usePostData } from "@/hooks/useFetch";
import { useModalStore } from "@/hooks/useModalStore";

export const AddOfferModal = () => {
  const lang = useLocale();
  const t = useTranslations("projectDetails.project.modal");
  const router = useRouter();
  const { isOpen, closeModal, type, data } = useModalStore();
  const isModalOpen = type === "addOffer" && isOpen && data;
  type Data = { projectId: number | string };
  const modalData = data as Data;

  const [input, setInput] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headers = createHeaders();

  const endpoint = "/applications";
  const props: FetchData = { endpoint, config: { headers: { ...headers, lang } } };
  const { mutateAsync } = usePostData(props);

  const handleModalClose = () => {
    closeModal();
    setInput("");
    setErrors([]);
  };

  const numberHelper = (val: string) => {
    const value = val.trim();
    if (isEmpty(value)) return setErrors([t("validation.required")]);
    if (!isInt(value, { min: 1 })) return setErrors([t("validation.invalid")]);
    return setErrors([]);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    numberHelper(value);
    setInput(value);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let id;
    toast.dismiss(id);
    setIsSubmitting(true);
    numberHelper(input);

    const res = await mutateAsync({
      request_id: parseInt(modalData.projectId.toString()),
      price: parseInt(input),
    });
    if (res.status === "fail") {
      setErrors(res.message);
    }

    if (res.status === "success") {
      toast.success(t("success"), {
        description: t("success_desc"),
        duration: 3000,
      });
      router.refresh();
      handleModalClose();
    }

    setIsSubmitting(false);
  };

  if (!isModalOpen) return null;
  return (
    <Dialog open={isOpen} modal onOpenChange={handleModalClose}>
      <DialogContent className="space-y-5 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-4xl font-semibold">{t("title")}</DialogTitle>
          <DialogDescription className="sr-only">{t("description")}</DialogDescription>
        </DialogHeader>

        {/* Data Form */}
        <form onSubmit={(e) => handleFormSubmit(e)} className="space-y-5">
          <div className="space-y-3">
            <label htmlFor="offer" className="text-lg font-semibold">
              {t("label")}
            </label>
            <div className="relative">
              <Banknote className="absolute size-4 start-3.5 top-1/2 -translate-y-1/2 text-garyClr" />
              <Input
                type="number"
                id="offer"
                placeholder={t("placeholder")}
                value={input}
                className="ps-9 bg-[#F6FBF8] rounded-2.5xl border-garyClr py-5"
                disabled={isSubmitting}
                onChange={handleInputChange}
              />
            </div>
            {errors && <FormErrors errors={errors} />}
          </div>
          <Button className="w-full py-5">{t("send")}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
