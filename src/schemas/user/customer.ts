import { isAlpha } from "validator";
import { z } from "zod";

export const ValidationMessages = z.object({
  name: z.object({
    required: z.string(),
    invalid: z.string(),
  }),
  email: z.object({
    required: z.string(),
    invalid: z.string(),
  }),
  password: z.object({
    required: z.string(),
    invalid: z.string(),
  }),
  phone: z.object({
    required: z.string(),
    invalid: z.string(),
  }),
  location: z.object({
    required: z.string(),
  }),
});
export type TValidationMessages = z.infer<typeof ValidationMessages>;

export const createCustomerSchema = (messages: TValidationMessages) => {
  const schema = z.object({
    name: z
      .string()
      .min(1, { message: messages.name.required })
      .refine(
        (name) => {
          const isLatin = isAlpha(name, "en-US", { ignore: " " });
          const isArabic = isAlpha(name, "ar", { ignore: " " });
          return isLatin || isArabic;
        },
        { message: messages.name.invalid }
      ),
    email: z.string().email({ message: messages.email.invalid }).min(1, { message: messages.email.required }),
    password: z.string().min(8, { message: messages.password.invalid }).min(1, { message: messages.password.required }),
    phone: z
      .string({ message: messages.phone.required })
      .min(1, { message: messages.phone.required })
      .refine(
        (number) => {
          const regex = new RegExp(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/);
          return regex.test(number);
        },
        { message: messages.phone.invalid }
      ),
    gender: z.enum(["MALE", "FEMALE"]),
    location: z.string({ message: messages.location.required }).min(1, { message: messages.location.required }),
  });
  return schema;
};
