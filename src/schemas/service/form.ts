import { isURL } from "validator";
import { z } from "zod";

export const formValidationSchema = z.object({
  name: z.object({
    required: z.string(),
    invalid: z.string(),
  }),
  req_activities: z.string(),
  period: z.string(),
  city: z.string(),
  neighborhood: z.string(),
  location_link: z.object({
    required: z.string(),
    invalid: z.string(),
  }),
  description: z.string(),
});
export type FormValidationSchema = z.infer<typeof formValidationSchema>;

export const createServiceFormSchema = (messages: FormValidationSchema) => {
  const schema = z.object({
    name: z.string().min(3, { message: messages.name.required }).max(255, { message: messages.name.invalid }),
    req_activities: z.array(z.string()).min(1, { message: messages.req_activities }),
    period: z.string().min(1, { message: messages.period }),
    city: z.string().min(1, { message: messages.city }),
    neighborhood: z.string().min(1, { message: messages.neighborhood }),
    location_link: z
      .string()
      .min(1, { message: messages.location_link.required })
      .refine(
        (val) => {
          return isURL(val);
        },
        { message: messages.location_link.invalid }
      ),
    description: z.string().min(1, { message: messages.description }),
  });
  return schema;
};
