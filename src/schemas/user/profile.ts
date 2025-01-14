import { array, number, object, string, union, z } from "zod";

import { transactionsSchema } from "@/schemas/transaction";

export const RoleSchema = z.enum(["CUSTOMER", "FREELANCER", "CONTRACTOR", "OFFICE", "ADMIN"]);

export const ProfileSchema = object({
  id: string(),
  name: string(),
  email: string().email(),
  phone: string().refine(
    (number) => {
      const regex = new RegExp(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/);
      return regex.test(number);
    },
    { message: "رقم الجوال غير صالح" }
  ),
  location: string(),
  role: RoleSchema,
  image: string().nullable(),
  transactions: transactionsSchema,
});

export const CustomerProfileSchema = object({
  ...ProfileSchema.shape,
  role: z.literal("CUSTOMER"),
});

export const FreelancerProfileSchema = object({
  ...ProfileSchema.shape,
  role: z.literal("FREELANCER"),
  services: array(
    object({
      id: union([string(), number()]),
      name: string(),
    })
  ),
  about: string(),
  identity_number: string(),
});

export const EngCustomerProfileSchema = object({
  ...ProfileSchema.shape,
  role: union([z.literal("CONTRACTOR"), z.literal("OFFICE")]),
  services: array(
    object({
      id: union([string(), number()]),
      name: string(),
    })
  ),
  about: string(),
  commercial_register_number: string(),
  facilityType: object({
    id: union([string(), number()]),
    name: string(),
  }),
});

export const PaymentDetailsSchema = object({
  payout_type: string().refine((type) => ["BANK", "WALLET"].includes(type), { message: "نوع التحويل غير صالح" }),
  IBAN: string().optional(),
  wallet_phone: string().optional(),
  country: string().optional(),
  city: string().optional(),
}).superRefine((data, ctx) => {
  if (data.payout_type === "BANK") {
    if (!data.IBAN) {
      ctx.addIssue({
        path: ["IBAN"],
        message: "رقم الحساب مطلوب لتحويل البنك",
        code: "custom",
      });
    }
  } else if (data.payout_type === "WALLET") {
    if (!data.wallet_phone) {
      ctx.addIssue({
        path: ["wallet_phone"],
        message: "رقم الجوال مطلوب لتحويل المحفظة",
        code: "custom",
      });
    }
  }
});

export type Role = z.infer<typeof RoleSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type CustomerProfile = z.infer<typeof CustomerProfileSchema>;
export type FreelancerProfile = z.infer<typeof FreelancerProfileSchema>;
export type EngCustomerProfile = z.infer<typeof EngCustomerProfileSchema>;
export type PaymentDetails = z.infer<typeof PaymentDetailsSchema>;
