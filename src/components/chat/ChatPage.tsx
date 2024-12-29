"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

import { ChatContext } from "@/providers/chat.context";

import AllSessions from "./AllSessions";
import ChatSession from "./ChatSession";
import { ChatSessionItem, ChatSessions } from "@/schemas/chat";
import { socket } from "@/socket";

const ChatPage = ({ userId }: { userId: string }) => {
  const t = useTranslations("chat");

  const [isConnected, setIsConnected] = useState(false);
  const [sessionMessages, setSessionMessages] = useState<ChatSessionItem>();
  const [activeSession, setActiveSession] = useState<ChatSessions>();

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
          className={`col-span-full h-full overflow-y-auto ${activeSession ? "block" : "hidden"} md:block md:col-span-7 lg:col-span-8`}
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

        <AllSessions newMessages={sessionMessages} />
      </div>
    </ChatContext.Provider>
  );
};

export default ChatPage;
