import { array, number, object, string, z } from "zod";

const ProviderProfileSchema = object({
  id: string(),
  name: string(),
  email: string(),
  phone: string(),
  location: string(),
  role: string(),
  about: string(),
  logo: string(),
  commercialNumber: string(),
  type: object({ name: string() }),
  image: string(),
  facilityType: object({ name: string() }),
  services: array(
    object({
      id: number(),
      name: string(),
    })
  ),
  numOfProjects: number(),
});

type ProviderProfileType = z.infer<typeof ProviderProfileSchema>;

export { ProviderProfileSchema };
export type { ProviderProfileType };
