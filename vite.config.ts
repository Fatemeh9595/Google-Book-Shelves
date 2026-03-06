import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: [
          "legacy-js-api",
          "import",
          "if-function",
          "global-builtin",
          "color-functions"
        ]
      }
    }
  },
  server: {
    // Needed for cloud dev environments like CodeSandbox preview domains.
    host: true,
    allowedHosts: [".csb.app", ".codesandbox.io", "localhost"]
  }
});
