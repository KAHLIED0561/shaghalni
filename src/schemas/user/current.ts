import { z } from "zod";

export const CurrentUserSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image: z.union([z.string(), z.null()]),
    role: z.enum(["CUSTOMER", "FREELANCER", "CONTRACTOR", "OFFICE", "ADMIN"]),
  })
  .nullable();
