import { z } from "zod";

export const CitySchema = z.object({
  id: z.union([z.string(), z.number()]),
  code: z.union([z.string(), z.number()]),
  name: z.string(),
});
