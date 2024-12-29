import Image from "next/image";

import TimeDateFormate from "./TimeDateFormaed";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  type?: string;
}

export function ChatMessage({ message, isUser, timestamp, type }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? "justify-start" : "justify-end"} mb-2`}>
      {type === "IMAGE" ? (
        <Image className="w-72 max-w-full object-contain" src={message} alt="image" width={400} height={400} />
      ) : (
        <div
          className={`max-w-[70%] rounded-xl px-4 py-2 ${
            isUser ? "bg-primaryClr-700 text-white rounded-es-none" : "bg-gray-100 text-gray-800 rounded-ee-none"
          }`}
        >
          <p className="text-sm break-all">{message}</p>
          {timestamp && (
            <span className="text-xs opacity-90 mt-1 block">
              <TimeDateFormate timestamp={timestamp} />
            </span>
          )}
        </div>
      )}

      {/* {!isUser && <UserCircle2 className="w-6 h-6 text-gray-600 mr-2 flex-shrink-0" />} */}
    </div>
  );
}
