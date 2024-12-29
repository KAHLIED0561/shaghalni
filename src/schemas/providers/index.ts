import { array, number, object, string, union, z } from "zod";

const SingleProviderSchema = object({
  id: union([string(), number()]),
  title: string(),
  description: string(),
  imageUrl: string(),
  imageAlt: string(),
  location: string(),
  type: string(),
  role: string(),
  numOfProjects: number(),
});

const ProviderRes = object({
  total: number(),
  providers: array(SingleProviderSchema),
});

type SingleProviderType = z.infer<typeof SingleProviderSchema>;
type ProviderResType = z.infer<typeof ProviderRes>;

export { SingleProviderSchema, ProviderRes };
export type { SingleProviderType, ProviderResType };
