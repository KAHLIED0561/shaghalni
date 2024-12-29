"use client";

import { useTranslations } from "next-intl";

import { createHeaders } from "@/lib/createHeaders";
import type { FetchData } from "@/lib/request";

import { ReviewCard } from "@/components/providers";
import { Button } from "@/components/ui/button";

import { useGetData } from "@/hooks/useFetch";
import { useModalStore } from "@/hooks/useModalStore";

import { ReviewList } from "@/schemas/share";

type ProfileReviewsProps = {
  id: string;
};

export const ProfileReviews = ({ id }: ProfileReviewsProps) => {
  const t = useTranslations("share.provider.reviews");
  const { openModal } = useModalStore();

  const headers = createHeaders();
  const endpoint = `/reviews/${id}`;
  const propsReviews: FetchData = { endpoint, config: { headers } };
  const { data, status } = useGetData<ReviewList>(propsReviews);
  const reviews = data?.status === "success" ? data.response : null;

  const handleAddReview = () => {
    openModal("addReview", { reviewedUserId: id });
  };

  if (status === "pending" || status === "error" || data?.status === "fail") return null;
  return (
    <section className="pt-8 space-y-6">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4">
        <h2 className="text-4xl font-semibold">{t("title")}</h2>
        <Button onClick={handleAddReview} className="w-fit">
          {t("write")}
        </Button>
      </div>
      <div>
        {reviews?.length === 0 && <p className="text-center">{t("no_reviews")}</p>}
        {reviews && (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id}>
                <ReviewCard {...review} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
