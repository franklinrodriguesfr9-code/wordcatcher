import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/wordcatcher/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["wordcatcher-icon.svg"],
      manifest: {
        name: "WordCatcher",
        short_name: "WordCatcher",
        description: "A local-first listening and shadowing vocabulary notebook.",
        theme_color: "#12111a",
        background_color: "#12111a",
        display: "standalone",
        orientation: "portrait",
        scope: "/wordcatcher/",
        start_url: "/wordcatcher/",
        icons: [
          {
            src: "/wordcatcher/wordcatcher-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"]
      }
    })
  ],
  test: {
    environment: "jsdom",
    exclude: ["e2e/**", "node_modules/**", "dist/**"],
    setupFiles: "./src/test/setup.ts",
    css: true,
    globals: true
  }
});
