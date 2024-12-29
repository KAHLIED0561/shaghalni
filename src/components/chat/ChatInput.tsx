"use client";

import UploadImgModal from "../modals/UploadImgModal";
import { Send } from "lucide-react";
import { useContext, useState } from "react";

import { ChatContext } from "@/providers/chat.context";

import { socket } from "@/socket";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const { activeSession } = useContext(ChatContext);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() && activeSession) {
      socket.emit("message", {
        sessionId: activeSession.id,
        content: message,
        type: "TEXT",
      });
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex gap-2 p-4">
      <button
        type="submit"
        className="shrink-0 h-auto w-12 flex items-center justify-center rounded-full bg-primaryClr-500 text-white hover:bg-primaryClr-600 transition-colors"
      >
        <Send className="w-5 h-5" />
      </button>

      <div className="relative flex-1">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full rounded-full px-4 py-2 bg-gray-100 pe-10 focus:outline-none focus:ring-2 focus:ring-primaryClr-500"
        />

        <UploadImgModal sessionId={activeSession?.id} />
      </div>
    </form>
  );
}

export default ChatInput;
