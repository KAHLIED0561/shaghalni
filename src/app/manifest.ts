import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const isProduction = process.env.NODE_ENV === "production";
  const start_url = isProduction ? "https://shaghalni.sa" : "http://localhost:3000";

  return {
    name: "Shaghalni",
    short_name: "Shaghalni",
    start_url,
    theme_color: "#013237",
    background_color: "#013237",
    display: "standalone",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
