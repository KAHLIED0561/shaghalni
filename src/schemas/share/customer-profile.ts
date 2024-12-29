import { number, object, string, z } from "zod";

const CustomerProfileSchema = object({
  id: string(),
  name: string(),
  email: string(),
  phone: string(),
  location: string(),
  role: string(),
  gender: string(),
  image: string(),
  numOfProjects: number(),
});

type CustomerProfileType = z.infer<typeof CustomerProfileSchema>;

export { CustomerProfileSchema };
export type { CustomerProfileType };
