import { z } from "zod";

import { ProjectSimpleSchema } from "@/schemas/project";

export const HomeSchema = z.object({
  location: z.array(
    z.object({
      id: z.union([z.string(), z.number()]),
      option: z.string(),
    })
  ),
  providers: z.array(
    z.object({
      id: z.union([z.string(), z.number()]),
      imageUrl: z.string(),
      imageAlt: z.string(),
      title: z.string(),
      description: z.string(),
      location: z.string(),
      numOfProjects: z.number(),
    })
  ),
  projects: z.array(z.object({ ...ProjectSimpleSchema.shape })),
  qa: z.array(z.object({ id: z.union([z.string(), z.number()]), qTitle: z.string(), qAnswer: z.string() })),
});
