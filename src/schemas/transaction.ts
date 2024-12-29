import { array, number, object, string, union, z } from "zod";

export const transactionSchema = object({
  id: union([string(), number()]),
  image: string().nullable(),
  fromName: string(),
  toName: string(),
  value: number(),
  type: z.enum(["CASH", "CARD"]),
  date: string(),
});

export const transactionsSchema = array(transactionSchema);
