"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { createHeaders } from "@/lib/createHeaders";

import { usePostData } from "@/hooks/useFetch";

export function ChatInput({
  sessionId,
  addOptimisticMessage,
}: {
  sessionId: string | null;
  addOptimisticMessage: (content: string) => void;
}) {
  const endpoint = "/chat/message";
  const headers = createHeaders();
  const [message, setMessage] = useState("");
  const { mutateAsync } = usePostData({
    endpoint,
    config: { headers },
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && sessionId) {
      addOptimisticMessage(message);
      setMessage("");
      
      try {
        await mutateAsync({
          sessionId,
          content: message,
          type: "TEXT",
        });
      } catch (error) {
        console.error("Failed to send message:", error);
      }
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
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primaryClr-500"
      />
    </form>
  );
}

export default ChatInput;
