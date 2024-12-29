"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { createHeaders } from "@/lib/createHeaders";

import { useGetData } from "@/hooks/useFetch";

import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./_ChatInput";
import { ChatSessionItem } from "@/schemas/chat";

const ChatSession = ({ userId }: { userId: string }) => {
  const headers = createHeaders();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref to scroll to bottom
  const [localMessages, setLocalMessages] = useState<ChatSessionItem[]>([]);

  const {
    data: sessionItem,
    isLoading,
    refetch,
  } = useGetData<ChatSessionItem[]>({
    endpoint: "/chat/session/" + sessionId,
    config: { headers },
  });

  // Add optimistic message to local state
  const addOptimisticMessage = (content: string) => {
    const optimisticMessage = {
      id: Date.now(),
      senderId: userId,
      content,
      createdAt: new Date().toISOString(),
      type: "TEXT",
      chatSessionId: Number(sessionId),
      receiverId: "",
    };

    setLocalMessages((prev) => [...prev, optimisticMessage]);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Add session messages to local state on mount
  useEffect(() => {
    if (sessionItem?.status === "success") {
      setLocalMessages(sessionItem.response);
    }
  }, [sessionItem]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);
    return () => clearInterval(interval);
  }, [sessionItem]);

  if (!sessionItem || isLoading) return null;

  return (
    <div className="rounded-2.5xl border border-gray-200 divide-y h-full flex flex-col">
      <div className="p-5"></div>

      <div className="flex-1 overflow-y-auto p-5">
        {localMessages
          ?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((message) => (
            <ChatMessage
              isUser={message.senderId === userId}
              message={message.content}
              timestamp={message.createdAt}
              key={message.id}
            />
          ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="">
        <ChatInput sessionId={sessionId} addOptimisticMessage={addOptimisticMessage} />
      </div>
    </div>
  );
};

export default ChatSession;
