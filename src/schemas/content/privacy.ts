import { object, string, z } from "zod";

const PrivacySchema = object({
  content: object({
    content: string(),
  }),
});

export type PrivacyType = z.infer<typeof PrivacySchema>;
export { PrivacySchema };
