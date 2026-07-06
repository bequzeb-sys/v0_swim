import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SwimAI — Trouvez votre coach de natation",
    short_name: "SwimAI",
    description:
      "Réservez des coachs de natation certifiés près de chez vous. Progressez plus vite grâce à l'IA.",
    start_url: "/fr",
    display: "standalone",
    background_color: "#0a1f3d",
    theme_color: "#0d2a52",
    orientation: "portrait-primary",
    scope: "/",
    lang: "fr",
    categories: ["sports", "health", "education"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [],
  }
}
