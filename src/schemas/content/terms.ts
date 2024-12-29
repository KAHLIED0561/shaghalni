import { object, string, z } from "zod";

const TermsSchema = object({
  content: object({
    content: string(),
  }),
});

export type TermsType = z.infer<typeof TermsSchema>;
export { TermsSchema };
