import { CustomerProfileSchema, type CustomerProfileType } from "./customer-profile";
import { ProviderProfileSchema, type ProviderProfileType } from "./provider-profile";
import { ReviewListSchema, ReviewSchema } from "./review-profile";
import type { Review, ReviewList } from "./review-profile";
import { type ProjectRes, ProjectResSchema } from "@/schemas/project";

export { CustomerProfileSchema, ProviderProfileSchema, ProjectResSchema, ReviewListSchema, ReviewSchema };
export type { CustomerProfileType, ProviderProfileType, ProjectRes, Review, ReviewList };
