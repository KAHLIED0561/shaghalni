import { Cairo, Roboto } from "next/font/google";
import LocalFonts from "next/font/local";
import { ReactNode } from "react";

const Robotofont = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

const cairoFont = Cairo({
  subsets: ["arabic"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  fallback: ["Helvetica", "Arial", "sans-serif"],
  variable: "--font-cairo",
});

const chillaxFont = LocalFonts({
  src: [
    // variable
    { path: "../assets/fonts/chillax/Variable.ttf", weight: "100 900" },
    { path: "../assets/fonts/chillax/Variable.woff", weight: "100 900" },
    { path: "../assets/fonts/chillax/Variable.woff2", weight: "100 900" },
  ],
  display: "auto",
  variable: "--font-chillax",
  fallback: ["Roboto", "Helvetica", "Arial", "sans-serif"],
});

type FontProps = {
  children: ReactNode;
};

export const FontProvider = ({ children }: FontProps) => {
  return <body className={`${cairoFont.variable} ${chillaxFont.variable} ${Robotofont.variable}`}>{children}</body>;
};
