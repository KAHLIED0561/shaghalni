import { z } from "zod";

export const ResetPassSchema = z.object({
  message: z.string(),
  token: z.string(),
});
