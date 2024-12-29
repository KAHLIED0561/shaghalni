"use client";

import { StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { createHeaders } from "@/lib/createHeaders";
import { FetchData } from "@/lib/request";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useGetData, usePostData } from "@/hooks/useFetch";
import { useModalStore } from "@/hooks/useModalStore";

type Data = {
  reviewedUserId: string;
};

export const ReviewModal = () => {
  const t = useTranslations("share.provider.reviews");
  const { isOpen, type, data, closeModal } = useModalStore();
  const [rating, setRating] = useState(0);
  const isModalOpen = isOpen && type === "addReview" && data;
  const modalData = data as Data;

  const headers = createHeaders();
  const endpoint = "/reviews";
  const getEndpoint = `/reviews/${modalData ? modalData.reviewedUserId : null}`;
  const props: FetchData = { endpoint, config: { headers } };
  const propsReviews: FetchData = { endpoint: getEndpoint, config: { headers } };
  const { refetch } = useGetData(propsReviews);
  const { mutateAsync } = usePostData(props);

  const handleRating = (value: number) => {
    setRating(value);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let id;
    toast.dismiss(id);

    const form = e.currentTarget;
    const review = form.elements.namedItem("review") as HTMLTextAreaElement;
    const reviewValue = review.value.trim();

    const res = await mutateAsync({ review: reviewValue, rating, reviewedUserId: modalData.reviewedUserId });
    if (res.status === "fail") {
      const concatenateErrors = Object.values(res.message).join("\n");
      id = toast.error(concatenateErrors, { duration: 5000 });
    }

    if (res.status === "success") {
      toast.success(t("review.success"), { duration: 3000 });
      closeModal();
      refetch();
      setRating(0);
      form.reset();
    }
  };

  if (!isModalOpen) return null;
  return (
    <Dialog open={isOpen} modal onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center font-semibold text-4xl">{t("write")}</DialogTitle>
          <DialogDescription className="hidden">{t("review.placeholder")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div>
            <ul className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <li key={value}>
                  <button type="button" onClick={() => handleRating(value)}>
                    <StarIcon
                      className={cn("size-8", rating >= value ? "fill-yellow-500 text-yellow-500" : "text-gray-400")}
                    />
                  </button>
                </li>
              ))}
            </ul>
            <div>
              <label htmlFor="review" className="block text-lg">
                {t("review.label")}
              </label>
              <textarea
                id="review"
                className="w-full p-4 mt-2 bg-gray-100 rounded-lg resize-none"
                placeholder={t("review.placeholder")}
                required
              />
            </div>
            <Button type="submit" className="w-full mt-4">
              {t("review.send")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
