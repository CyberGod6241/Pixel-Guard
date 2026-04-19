import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// import ngrok from "vite-plugin-ngrok";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // ngrok("3Cal27flXYdWw9jZr8k18VdUvLw_5pEro9ezSK4r5k5pDuWaL"),
  ],
});
