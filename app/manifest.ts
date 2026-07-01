import type { MetadataRoute } from "next"

// TODO: Add icon-192.png and icon-512.png to /public
// These can be generated from icon.svg using:
// https://www.pwabuilder.com or https://realfavicongenerator.net
// Required sizes: 192x192 and 512x512

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SwimAI — Trouvez votre coach de natation",
    short_name: "SwimAI",
    description:
      "Réservez des coachs de natation certifiés près de chez vous. Progressez plus vite grâce à l'IA.",
    start_url: "/fr",
    display: "standalone",
    background_color: "#050B1A",
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
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    screenshots: [],
  }
}
