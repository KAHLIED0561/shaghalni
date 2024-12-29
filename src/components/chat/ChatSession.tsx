"use client";

import { Button } from "../ui/button";
import { ArrowLeftIcon, OctagonAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";

import { createHeaders } from "@/lib/createHeaders";

import { useGetData } from "@/hooks/useFetch";

import { ChatContext } from "@/providers/chat.context";

import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { ChatSessionItem } from "@/schemas/chat";

const ChatSession = ({ userId, newMessages }: { userId: string; newMessages?: ChatSessionItem }) => {
  const t = useTranslations("chat");
  const headers = createHeaders();
  const messagesContentRef = useRef<HTMLDivElement | null>(null);
  const [localMessages, setLocalMessages] = useState<ChatSessionItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const { activeSession, setActiveSession } = useContext(ChatContext);

  const { data: sessionItem, isLoading } = useGetData<ChatSessionItem[]>({
    endpoint: "/chat/session/" + activeSession?.id,
    config: { headers, queryParams: { page: String(page), limit: "30" } },
  });

  useEffect(() => {
    if (sessionItem?.status === "success") {
      if (page === 1 && messagesContentRef.current) {
        setLocalMessages(sessionItem.response);

        setTimeout(() => {
          if (messagesContentRef.current) {
            messagesContentRef.current.scrollTop = messagesContentRef.current.scrollHeight;
          }
        }, 100);
      } else {
        setLocalMessages([...sessionItem.response, ...localMessages]);
      }
    }
  }, [sessionItem]);

  useEffect(() => {
    if (newMessages?.chatSessionId == Number(activeSession?.id)) {
      setLocalMessages((prev) => [...prev, newMessages]);
    }
  }, [newMessages]);

  const handleScroll = () => {
    if (sessionItem?.status === "success" && messagesContentRef.current && page <= 100 && !isLoading) {
      if (messagesContentRef.current.scrollTop < 50) {
        setPage((prev) => prev + 1);
      }
    }
  };

  return (
    <div className="rounded-2.5xl border border-gray-200 divide-y h-full flex flex-col">
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Image
            src={activeSession?.user?.image || "/user.png"}
            alt="avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />

          <p className="text-sm font-medium">{activeSession?.user?.name}</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-primaryClr flex items-center gap-2 hover:text-primaryClr-800">
            <OctagonAlertIcon size={18} />

            <span className="text-sm">{t("report")}</span>
          </button>

          <Button
            variant="default"
            size="icon"
            className="!w-7 !h-7 md:hidden"
            onClick={() => setActiveSession && setActiveSession(undefined)}
          >
            <ArrowLeftIcon size={16} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5" onScroll={handleScroll} ref={messagesContentRef}>
        {isLoading && (
          <div className="flex justify-center items-center pb-5">
            <div className="w-10 h-10 rounded-full border-4 border-gray-200 animate-spin border-y-gray-500" />
          </div>
        )}

        {localMessages
          ?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((message) => (
            <ChatMessage
              isUser={message.senderId === userId}
              message={message.content}
              timestamp={message.createdAt}
              key={message.id}
              type={message.type}
            />
          ))}
      </div>

      <ChatInput />
    </div>
  );
};

export default ChatSession;
