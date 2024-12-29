import { object, string, z } from "zod";

const WhoSchema = object({
  content: object({
    content: string(),
  }),
});

export type WhoType = z.infer<typeof WhoSchema>;
export { WhoSchema };
