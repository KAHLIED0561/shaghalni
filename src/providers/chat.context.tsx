import { createContext, useContext } from "react";



import { ChatSessions } from "@/schemas/chat";


interface Props {
  sessionId?: number;
  activeSession?: ChatSessions;
  isLoading?: boolean;
  setActiveSession?: (session: ChatSessions | undefined) => void;
  setIsLoading?: (isLoading: boolean) => void;
  setSessionId?: (sessionId: number) => void;
}

export const ChatContext = createContext<Props>({
  sessionId: undefined,
  activeSession: undefined,
  isLoading: false,
  setActiveSession: undefined,
  setIsLoading: undefined,
  setSessionId: undefined,
});

export const useChatContext = () => createContext(ChatContext);