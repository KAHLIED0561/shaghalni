import { array, number, object, string, z } from "zod";

const ReviewSchema = object({
  id: number(),
  autherId: string(),
  reviewedUserId: string(),
  rating: number(),
  review: string(),
  autherName: string(),
  autherImage: string(),
});

const ReviewListSchema = array(ReviewSchema);

type Review = z.infer<typeof ReviewSchema>;
type ReviewList = z.infer<typeof ReviewListSchema>;

export { ReviewSchema, ReviewListSchema };
export type { Review, ReviewList };
