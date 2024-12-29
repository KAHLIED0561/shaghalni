import { z } from "zod";

export const VerifyOtpSchema = z.object({
  email: z.string().email(),
  tmpSession: z.string(),
});
