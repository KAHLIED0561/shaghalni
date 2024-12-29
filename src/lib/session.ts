import { jwtDecode } from "jwt-decode";

export type Session = {
  id: string;
  role: string;
  email: string;
  iat: number;
  exp: number;
};

export const decodeSession = (session: string): Session => {
  return jwtDecode(session);
};

export const verifySession = (session: string | undefined): boolean => {
  if (!session) return false;
  const { exp } = decodeSession(session);
  return exp > Date.now() / 1000;
};
