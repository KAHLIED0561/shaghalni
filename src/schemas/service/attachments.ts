import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 8; // 8MB
const ACCEPTED_ONLY_IMAGE = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const attachmentsValidationSchema = z.object({
  drawings: z.object({
    required: z.string(),
    size: z.string(),
    type: z.string(),
  }),
  building: z.object({
    size: z.string(),
    type: z.string(),
  }),
  attachments: z.object({
    size: z.string(),
    type: z.string(),
  }),
});
export type AttachmentsValidationSchema = z.infer<typeof attachmentsValidationSchema>;

export const createAttachmentsFormSchema = (messages: AttachmentsValidationSchema) => {
  const schema = z.object({
    drawings: z
      .instanceof(File, { message: messages.drawings.required })
      .refine((file) => {
        return !file || file.size < MAX_UPLOAD_SIZE;
      }, messages.drawings.size)
      .refine((file) => {
        return ACCEPTED_ONLY_IMAGE.includes(file.type);
      }, messages.drawings.type),
    building: z
      .instanceof(File)
      .refine((file) => {
        return !file || file.size < MAX_UPLOAD_SIZE;
      }, messages.building.size)
      .refine((file) => {
        return ACCEPTED_ONLY_IMAGE.includes(file.type);
      }, messages.building.type)
      .optional(),
    attachments: z
      .instanceof(File)
      .refine((file) => {
        return !file || file.size < MAX_UPLOAD_SIZE;
      }, messages.attachments.size)
      .refine((file) => {
        return ACCEPTED_ONLY_IMAGE.includes(file.type);
      }, messages.attachments.type)
      .optional(),
  });
  return schema;
};
