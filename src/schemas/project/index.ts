import { z } from "zod";

const ProjectSimpleSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  imageUrl: z.string(),
  imageAlt: z.string(),
  created_at: z.coerce.date(),
  expired_at: z.coerce.date(),
  status: z.string(),
  statusFlag: z.number(),
  locationId: z.union([z.string(), z.number()]),
  description: z.string(),
  created_by: z.string(),
  providerId: z.string().optional(),
  town: z.string().optional(),
  serviceNames: z.array(z.string()),
  serviceType: z.string(),
  locationName: z.string(),
  createdByName: z.string(),
  numberOfOffers: z.number(),
  remainingTime: z.string(),
  landArea: z.string().optional(),
  numOfFloors: z.number().optional(),
});

const ProjectStatusSchema = z.object({
  key: z.string(),
  value: z.string(),
});

const ProjectResSchema = z.object({
  numberOfProjects: z.number(),
  formattedRequests: z.array(ProjectSimpleSchema),
});

const ProjectSchema = z.object({
  ...ProjectSimpleSchema.shape,
  canApply: z.boolean(),
  canAccept: z.boolean(),
  attachments: z.array(
    z.object({
      id: z.union([z.string(), z.number()]),
      title: z.string(),
      size: z.string(),
      url: z.string(),
      type: z.enum(["IMAGE", "PDF"]),
    })
  ),
  offers: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]),
        imageUrl: z.string(),
        imageAlt: z.string(),
        title: z.string(),
        type: z.string(),
        value: z.number(),
      })
    )
    .optional(),
  winner: z
    .object({
      id: z.union([z.string(), z.number()]),
      title: z.string(),
      type: z.string(),
      imageUrl: z.string(),
      imageAlt: z.string(),
    })
    .optional(),
  services: z.array(
    z.object({
      requestId: z.union([z.string(), z.number()]),
      serviceId: z.union([z.string(), z.number()]),
      service: z.object({
        id: z.union([z.string(), z.number()]),
        en_name: z.string(),
        ar_name: z.string(),
      }),
    })
  ),
  location: z.object({
    id: z.union([z.string(), z.number()]),
    code: z.string(),
    en_name: z.string(),
    ar_name: z.string(),
  }),
});

type ProjectSimple = z.infer<typeof ProjectSimpleSchema>;
type ProjectRes = z.infer<typeof ProjectResSchema>;
type Project = z.infer<typeof ProjectSchema>;
type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

export { ProjectSimpleSchema, ProjectSchema, ProjectResSchema, ProjectStatusSchema };
export type { ProjectSimple, Project, ProjectRes, ProjectStatus };
