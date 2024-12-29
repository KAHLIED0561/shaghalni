import { z } from "zod";

export const loginSuccessSchema = z.object({
  message: z.string(),
  token: z.string(),
});
export const loginErrorSchema = z.object({
  needToVerify: z.boolean(),
});
