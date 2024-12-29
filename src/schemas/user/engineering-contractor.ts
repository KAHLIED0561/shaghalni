import { isAlpha } from "validator";
import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 4; // 4MB
const ACCEPTED_ONLY_IMAGE = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/heic", "image/heif"];

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
  location: z
    .object({
      required: z.string(),
    })
    .optional(),
  commercialRegister: z.object({
    required: z.string(),
  }),
  facilityType: z.object({
    required: z.string(),
  }),
  activities: z.object({
    required: z.string(),
  }),
  description: z.object({
    required: z.string(),
  }),
  image: z.object({
    required: z.string(),
    size: z.string(),
    type: z.string(),
  }),
});
export type TValidationMessages = z.infer<typeof ValidationMessages>;

export const createEngineeringContractorSchema = (messages: TValidationMessages) => {
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
    password: z.string().min(8, { message: messages.password.required }),
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
    location: z
      .string()
      .min(1, { message: messages.location ? messages.location.required : "" })
      .optional(),
    commercialRegister: z.string().min(1, { message: messages.commercialRegister.required }),
    facilityType: z.string().min(1, { message: messages.facilityType.required }),
    activities: z.array(z.string()).min(1, { message: messages.activities.required }),
    description: z.string().min(1, { message: messages.description.required }),
    logo: z
      .instanceof(File, { message: messages.image.required })
      .refine((file) => {
        return !file || file.size < MAX_UPLOAD_SIZE;
      }, messages.image.size)
      .refine((file) => {
        return ACCEPTED_ONLY_IMAGE.includes(file.type);
      }, messages.image.type),
  });
  return schema;
};
