import { z } from "zod";

export const CustomerSchema = z.object({
  message: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.union([z.string(), z.number()]),
    otp: z.union([z.string(), z.number(), z.null()]),
    otp_expires_at: z.union([z.string(), z.null()]),
    address: z.union([z.string(), z.null()]),
    is_phone_verified: z.boolean(),
    is_email_verified: z.boolean(),
    is_account_verified: z.boolean(),
    role: z.string(),
    location: z.union([z.string(), z.null()]),
    gender: z.enum(["MALE", "FEMALE"]),
    delete_at: z.union([z.coerce.date(), z.null()]),
  }),
  customer: z.object({
    id: z.string(),
    user_id: z.string(),
    city_id: z.union([z.string(), z.number()]),
    identity_number: z.union([z.string(), z.number(), z.null()]),
  }),
  verificationMessage: z.string(),
});
