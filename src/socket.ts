"use client";

import cookieClient from "js-cookie";
import { io } from "socket.io-client";

import { SESSION_NAME } from "./constant";

export const socket = io("https://api.shaghalni.sa/chat", {
  query: {
    token: cookieClient.get(SESSION_NAME) || "",
  },
  transports: ["websocket"],
});
