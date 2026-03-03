import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Needed for cloud dev environments like CodeSandbox preview domains.
    allowedHosts: true
  }
});
