"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useContext } from "react";

import { cn } from "@/lib/utils";

import { ChatContext } from "@/providers/chat.context";

import TimeDateFormate from "./TimeDateFormaed";
import { ChatSessions } from "@/schemas/chat";

const ChatCard = ({ chat }: { chat: ChatSessions }) => {
  const { setActiveSession, activeSession } = useContext(ChatContext);
  const t = useTranslations("chat");

  return (
    <button
      className={cn(
        "flex w-full p-5 gap-4 bg-gray-50/50 hover:bg-primaryClr-500/20",
        activeSession?.id === chat.id && "bg-primaryClr-500/20"
      )}
      onClick={() => setActiveSession && setActiveSession(chat)}
    >
      <div className="shrink-0">
        <Image
          src={chat.user?.image || "/user.png"}
          alt={chat.user?.name || "user image"}
          width={60}
          height={60}
          title={chat.user?.name || "user image"}
          loading="lazy"
          className="w-[52px] h-[52px] rounded-full"
        />
      </div>

      <div className="flex-1 space-y-2 text-start">
        <p className="text-sm font-medium leading-none">{chat.user?.name}</p>
        <p className="text-xs text-gray-500 line-clamp-1 break-all">
          {chat?.lastMessage?.type === "IMAGE" ? t("photo") : chat?.lastMessage?.content}
        </p>
      </div>

      <div className="shrink-0">
        <p className="text-xs text-gray-500">
          <TimeDateFormate timestamp={chat?.lastMessage?.createdAt} />
        </p>
      </div>
    </button>
  );
};

export default ChatCard;
