"use client";

import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

import { createHeaders } from "@/lib/createHeaders";
import { cn } from "@/lib/utils";

import { useGetData } from "@/hooks/useFetch";

import { ChatContext } from "@/providers/chat.context";

import AllSessions from "./AllSessions";
import ChatSession from "./ChatSession";
import { ChatSessionItem, ChatSessions } from "@/schemas/chat";
import { socket } from "@/socket";

const ChatPage = ({ userId }: { userId: string }) => {
  const headers = createHeaders();
  const t = useTranslations("chat");

  const [isConnected, setIsConnected] = useState(false);
  const [sessionMessages, setSessionMessages] = useState<ChatSessionItem>();
  const [activeSession, setActiveSession] = useState<ChatSessions>();

  const { data: sessionItem, isLoading } = useGetData<ChatSessions[]>({
    endpoint: "/chat/sessions",
    config: { headers },
  });

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("message", (msg) => {
      setSessionMessages(msg);
    });

    socket.on("success", (msg) => {
      setSessionMessages(msg);
    });

    socket.on("error", (err) => {
      console.error("Error event:", err);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-white">
        {/* <div className="animate-spin rounded-full shrink-0 h-20 w-20 border-4 border-primaryClr border-y-transparent"></div> */}
        <Loader2Icon className="animate-spin text-primaryClr" size={60} />
      </div>
    );
  }

  const allSessions = sessionItem?.status === "success" ? sessionItem.response : [];

  return (
    <ChatContext.Provider
      value={{
        activeSession,
        setActiveSession: (session: ChatSessions | undefined) => {
          setActiveSession(session);
          setSessionMessages(undefined);
        },
      }}
    >
      <div className="grid grid-cols-12 h-dvh pt-24 pb-4 gap-6">
        <div
          className={cn(
            "col-span-full h-full overflow-y-auto md:block md:col-span-7 lg:col-span-8",
            activeSession ? "block" : "hidden",
            allSessions.length === 0 && !sessionMessages && "md:col-span-12 lg:col-span-12"
          )}
        >
          {!isConnected || !activeSession ? (
            <div className="rounded-2.5xl border border-gray-200 h-full flex flex-col justify-center items-center">
              <Image
                src="/no-message.png"
                width={400}
                height={400}
                quality={100}
                className="w-36 h-36 mb-6 opacity-80 object-contain"
                alt="loading"
              />
              <p className="text-gray-500 text-lg">{t("sessionNotFound")}</p>
            </div>
          ) : (
            <ChatSession userId={userId} newMessages={sessionMessages} key={activeSession?.id} />
          )}
        </div>

        {(allSessions.length > 0 || sessionMessages) && (
          <AllSessions newMessages={sessionMessages} sessionItem={allSessions} />
        )}
      </div>
    </ChatContext.Provider>
  );
};

export default ChatPage;
