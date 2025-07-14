import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  // Example additions:
  server: {
    proxy: {
      "/api": "http://localhost:5000", // Proxy API requests
      "/uploads": "http://localhost:5000", // Proxy image requests
    },
    port: 3000, // Custom dev server port
    // open: true, // Auto-open browser
  },
});
