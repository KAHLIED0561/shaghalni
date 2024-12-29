import { z } from "zod";

import { CurrentUserSchema } from "./user";

const ChatSessionsSchema = z.object({
  id: z.number(),
  user: CurrentUserSchema,
  lastMessage: z.object({
    id: z.number(),
    chatSessionId: z.number(),
    senderId: z.string(),
    receiverId: z.string(),
    content: z.string(),
    createdAt: z.string(),
    type: z.string(),
  }),
});

const ChatSessionItemSchema = z.object({
  id: z.number(),
  chatSessionId: z.number(),
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string(),
  createdAt: z.string(),
  type: z.string(),
});

type ChatSessions = z.infer<typeof ChatSessionsSchema>;
type ChatSessionItem = z.infer<typeof ChatSessionItemSchema>;

export { ChatSessionsSchema, ChatSessionItemSchema };
export type { ChatSessions, ChatSessionItem };
