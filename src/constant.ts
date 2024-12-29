const COOKIE_NAME = "NEXT_LOCALE";
const SESSION_NAME = "NEXT_SESSION";
const EMAIL_ADDRESS = "EMAIL_ADDRESS";
const PASSWORD_RESET = "PASSWORD_RESET";

const AUTH_ROUTES = [
  "/sign-in",
  "/register",
  "/forgot-password",
  "/verify-otp",
  "/new-password",
  "/sign-up/customer",
  "/sign-up/provider/freelancer",
  "/sign-up/provider/contractor",
  "/sign-up/provider/office",
];
const PUBLIC_ROUTES = [
  "/",
  "/privacy-policy",
  "/terms-conditions",
  "/providers",
  "/projects",
  "/blogs",
  "/contact",
  "/who-are-we",
  "/payment",
];
const DEFAULT_LOGIN_REDIRECT = "/";
const DEFAULT_LOGOUT_REDIRECT = "/sign-in";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

enum RequestType {
  "TECHNICIAN" = "TECHNICIAN",
  "CONTRACTOR" = "CONTRACTOR",
  "DESIGNER" = "DESIGNER",
  "ENGINEERING" = "ENGINEERING",
  "QUANTITY" = "QUANTITY",
}

export {
  COOKIE_NAME,
  SESSION_NAME,
  EMAIL_ADDRESS,
  PASSWORD_RESET,
  AUTH_ROUTES,
  PUBLIC_ROUTES,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_LOGOUT_REDIRECT,
  BASE_URL,
  API_URL,
  RequestType,
};
