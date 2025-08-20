import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
    build: {
      sourcemap: false,
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      viewport: "width=device-width, initial-scale=1.0",
    },
  },
  modules: ["@nuxt/image"],
  image: {
    provider: "vercel",
    domains: ["api.tvmaze.com"],
    format: ["webp", "avif"],
    quality: 95,
  },
});
