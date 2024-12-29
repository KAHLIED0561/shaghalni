import { useContext, useEffect, useState } from "react";

import { createHeaders } from "@/lib/createHeaders";

import { useGetData } from "@/hooks/useFetch";

import { ChatContext } from "@/providers/chat.context";

import ChatCard from "./ChatCard";
import { ChatSessionItem, ChatSessions } from "@/schemas/chat";

const AllSessions = ({ newMessages }: { newMessages?: ChatSessionItem }) => {
  const headers = createHeaders();
  const { activeSession } = useContext(ChatContext);

  const [localSessions, setLocalSessions] = useState<ChatSessions[]>([]);

  const { data: sessionItem, isLoading } = useGetData<ChatSessions[]>({
    endpoint: "/chat/sessions",
    config: { headers },
  });

  useEffect(() => {
    if (sessionItem?.status === "success") {
      setLocalSessions(sessionItem.response);
    }
  }, [sessionItem]);

  useEffect(() => {
    if (sessionItem?.status === "success") {
      const targetSession = sessionItem?.response?.find((session) => session.id === newMessages?.chatSessionId);

      if (targetSession) {
        const sessions = localSessions.filter((session) => session.id !== newMessages?.chatSessionId);

        setLocalSessions([
          {
            ...targetSession,
            lastMessage: {
              ...targetSession.lastMessage,
              ...newMessages,
            },
          },
          ...sessions,
        ]);
      }
    }
  }, [newMessages]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-white">
        <div className="animate-spin rounded-full shrink-0 h-20 w-20 border-4 border-primaryClr border-y-transparent"></div>
      </div>
    );
  }

  return (
    <div
      className={`col-span-full h-full overflow-y-auto ${activeSession ? "hidden" : "block"} md:block md:col-span-5 lg:col-span-4`}
    >
      <div className="h-full">
        <div className="rounded-2.5xl border border-gray-200 divide-y divide-gray-200 h-full overflow-hidden">
          {localSessions.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">No messages found</p>
            </div>
          )}
          
          {localSessions.map((session) => (
            <ChatCard chat={session} key={session.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllSessions;
