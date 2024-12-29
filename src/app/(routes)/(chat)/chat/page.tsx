import { cookies } from "next/headers";

import { decodeSession } from "@/lib/session";

import ChatPage from "@/components/chat/ChatPage";

import { SESSION_NAME } from "@/constant";

const Chat = async () => {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_NAME)?.value;
  if (!session) throw new Error("Session not found");

  const { id } = decodeSession(session);

  return (
    <main className="container">
      <ChatPage userId={id} />
    </main>
  );
};

export default Chat;
