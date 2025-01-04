import { useContext, useEffect, useState } from "react";

import { ChatContext } from "@/providers/chat.context";

import ChatCard from "./ChatCard";
import { ChatSessionItem, ChatSessions } from "@/schemas/chat";

const AllSessions = ({ newMessages, sessionItem }: { newMessages?: ChatSessionItem; sessionItem: ChatSessions[] }) => {
  const { activeSession } = useContext(ChatContext);

  const [localSessions, setLocalSessions] = useState<ChatSessions[]>([]);

  useEffect(() => {
    setLocalSessions(sessionItem);
  }, [sessionItem]);

  useEffect(() => {
    if (sessionItem) {
      const targetSession = sessionItem?.find((session) => session.id === newMessages?.chatSessionId);

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

  return (
    <div
      className={`col-span-full h-full overflow-y-auto ${activeSession ? "hidden" : "block"} md:block md:col-span-5 lg:col-span-4`}
    >
      <div className="h-full">
        <div className="rounded-2.5xl border border-gray-200 divide-y divide-gray-200 h-full overflow-hidden">
          {localSessions.map((session) => (
            <ChatCard chat={session} key={session.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllSessions;
