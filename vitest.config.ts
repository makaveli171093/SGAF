import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  define: { "import.meta.env.VITE_API_URL": JSON.stringify("http://127.0.0.1:1/api/v1") },
  test: { environment: "jsdom", include: ["tests/**/*.test.tsx"] },
});
