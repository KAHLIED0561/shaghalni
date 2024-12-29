import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { RequestType } from "@/constant";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenString(str: string, len: number) {
  if (str.length <= len) return str;

  // Find the last space within the limit
  const shortened = str.slice(0, len);
  const lastSpaceIndex = shortened.lastIndexOf(" ");

  if (lastSpaceIndex === -1) {
    // No space found, just return the truncated string with ellipsis
    return `${shortened}...`;
  }

  // Return up to the last full word and add ellipsis
  return `${shortened.slice(0, lastSpaceIndex)}...`;
}

export function formatCurrency(value: number, locale = "ar-SA") {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "SAR" }).format(value);
}

export function formatDate(date: string, locale = "ar-SA") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function mapRequestType(type: RequestType, lang: string) {
  const isAr = lang === "ar";
  switch (type) {
    case RequestType.TECHNICIAN:
      return { key: RequestType.TECHNICIAN, value: isAr ? "التعاقد مع فني" : "Hire a technician" };
    case RequestType.CONTRACTOR:
      return { key: RequestType.CONTRACTOR, value: isAr ? "التعاقد مع مقاول عام" : "Hiring a general contractor" };
    case RequestType.DESIGNER:
      return { key: RequestType.DESIGNER, value: isAr ? "التعاقد مع مصمم داخلي" : "Hiring an interior designer" };
    case RequestType.ENGINEERING:
      return {
        key: RequestType.ENGINEERING,
        value: isAr ? "التعاقد مع مكتب هندسي" : "Contracting with an engineering office",
      };
    case RequestType.QUANTITY:
      return {
        key: RequestType.QUANTITY,
        value: isAr ? "حساب الكميات وخطط الإنقاذ" : "Quantity surveying and rescue plans",
      };
    default:
      return { key: RequestType.TECHNICIAN, value: isAr ? "التعاقد مع فني" : "Hire a technician" };
  }
}
