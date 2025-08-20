import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        "vue", // ref, watch, computed, onMounted, etc.
        { "vue-router": ["useRoute", "useRouter"] }, // Nuxt auto-import replacements
      ],
      dts: false,
    }),
  ],
  test: {
    environment: "happy-dom",
    globals: true,
  },
  resolve: {
    alias: {
      "~": new URL("./app", import.meta.url).pathname,
      "~~": new URL(".", import.meta.url).pathname,
    },
  },
});
