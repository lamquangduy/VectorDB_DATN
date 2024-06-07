import react from "@vitejs/plugin-react-swc";
import million from "million/compiler";
import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    million.vite({
      mute: true,
      auto: {
        rsc: true,
        threshold: 0.05,
        // skip: ["useBadHook", /badVariable/g],
      },
    }),
    react(),
  ],

  resolve: {
    alias: [
      // { find: '@', replacement: resolve(__dirname, '/src') },
      { find: "@views", replacement: resolve(__dirname, "./src/views") },
      {
        find: "@components",
        replacement: resolve(__dirname, "./src/components"),
      },
      { find: "@utils", replacement: resolve(__dirname, "./src/utils") },
      { find: "@layouts", replacement: resolve(__dirname, "./src/layouts") },
      { find: "@routers", replacement: resolve(__dirname, "./src/routers") },
      {
        find: "@apolloClient",
        replacement: resolve(__dirname, "./src/services/apollo"),
      },
      {
        find: "@crawlerClient",
        replacement: resolve(__dirname, "./src/services/crawler"),
      },
      {
        find: "@assets",
        replacement: resolve(__dirname, "./src/assets"),
      },
      {
        find: "@redux",
        replacement: resolve(__dirname, "./src/redux"),
      },
      {
        find: "@hooks",
        replacement: resolve(__dirname, "./src/hooks"),
      },
      {
        find: "@constants",
        replacement: resolve(__dirname, "./src/constants"),
      },
    ],
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
});
