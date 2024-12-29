import { z } from "zod";

export const ServiceSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
});
